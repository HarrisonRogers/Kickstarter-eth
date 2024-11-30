import { Contract, ContractAbi } from 'web3'
import web3 from './web3'
import CampaignFactory from '../../eth/build/CampaignFactory.json'

class FactoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FactoryError'
  }
}

let campaignFactory: Contract<ContractAbi> | null = null

async function initializeFactory() {
  try {
    // Get the list of accounts
    const accounts = await web3.eth.getAccounts()

    if (!accounts || accounts.length === 0) {
      throw new FactoryError(
        'No Ethereum accounts available. Please make sure MetaMask is connected.'
      )
    }

    const abi = CampaignFactory.abi
    const address = '0x37da12D36B0bBdbef03002c2a94Ff8b7148BA0E4'

    // Validate contract address
    if (!web3.utils.isAddress(address)) {
      throw new FactoryError('Invalid contract address')
    }

    // Initialize the contract with default account
    campaignFactory = new web3.eth.Contract(abi, address, {
      from: accounts[0], // Set the default 'from' address
    })

    // Verify the contract exists
    const code = await web3.eth.getCode(address)
    if (code === '0x' || code === '0x0') {
      throw new FactoryError('No contract detected at the specified address')
    }

    return campaignFactory
  } catch (error) {
    console.error('Error initializing campaign factory:', error)
    throw error
  }
}

// Initialize the factory
const factory: Promise<Contract<ContractAbi> | null> = initializeFactory()

// Helper function to get the current account
export async function getCurrentAccount(): Promise<string> {
  const accounts = await web3.eth.getAccounts()
  if (!accounts || accounts.length === 0) {
    throw new FactoryError('No Ethereum accounts available')
  }
  return accounts[0]
}

// Example of how to use the factory with proper account handling
export async function getDeployedCampaigns(): Promise<string[]> {
  try {
    const instance = await factory
    if (!instance) {
      throw new FactoryError('Factory not initialized')
    }

    const account = await getCurrentAccount()
    return await instance.methods.getDeployedCampaigns().call({ from: account })
  } catch (error) {
    console.error('Error getting deployed campaigns:', error)
    throw error
  }
}

export default factory
