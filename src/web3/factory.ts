import { Contract, ContractAbi } from 'web3';
import web3 from './web3';
import CampaignFactory from '../../eth/build/CampaignFactory.json';
import 'dotenv/config';
import { getCampaignDetails, CampaignDetails } from './campaign';

class FactoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FactoryError';
  }
}

let campaignFactory: Contract<ContractAbi> | null = null;

async function initializeFactory() {
  try {
    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    if (!accounts || accounts.length === 0) {
      throw new FactoryError(
        'No Ethereum accounts available. Please make sure MetaMask is connected.'
      );
    }

    const abi = CampaignFactory.abi;
    const address = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS as string;

    // Validate contract address
    if (!web3.utils.isAddress(address)) {
      throw new FactoryError('Invalid contract address');
    }

    // Initialize the contract with default account
    campaignFactory = new web3.eth.Contract(abi, address, {
      from: accounts[0], // Set the default 'from' address
    });

    // Verify the contract exists
    const code = await web3.eth.getCode(address);
    if (code === '0x' || code === '0x0') {
      throw new FactoryError('No contract detected at the specified address');
    }

    return campaignFactory;
  } catch (error) {
    console.error('Error initializing campaign factory:', error);
    throw error;
  }
}

// Initialize the factory
const factory: Promise<Contract<ContractAbi> | null> = initializeFactory();

// Helper function to get the current account
export async function getCurrentAccount(): Promise<string> {
  const accounts = await web3.eth.getAccounts();
  if (!accounts || accounts.length === 0) {
    throw new FactoryError('No Ethereum accounts available');
  }
  return accounts[0];
}

// Example of how to use the factory with proper account handling
export async function getDeployedCampaigns(): Promise<CampaignDetails[]> {
  try {
    const instance = await factory;
    if (!instance) {
      throw new FactoryError('Factory not initialized');
    }

    const account = await getCurrentAccount();
    const campaigns: string[] = await instance.methods
      .getDeployedCampaigns()
      .call({ from: account });

    // Fetch details for each campaign
    const campaignDetails = await Promise.all(
      campaigns.map(getCampaignDetails)
    );

    return campaignDetails;
  } catch (error) {
    console.error('Error getting deployed campaigns:', error);
    throw error;
  }
}

// Instead of exporting the Promise directly, export a function that gets the instance
export async function getFactory(): Promise<Contract<ContractAbi>> {
  const instance = await factory;
  if (!instance) {
    throw new FactoryError('Factory not initialized');
  }
  return instance;
}

// You can keep the original export for backward compatibility
export default factory;
