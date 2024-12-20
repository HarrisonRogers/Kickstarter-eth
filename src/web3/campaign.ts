import web3 from './web3';
import Campaign from '../../eth/build/Campaign.json';

export interface CampaignDetails {
  address: string;
  title: string;
  description?: string;
  minimumContribution?: string;
  balance?: string;
  manager?: string;
}

export async function getCampaignDetails(
  address: string
): Promise<CampaignDetails> {
  try {
    const campaign = new web3.eth.Contract(Campaign.abi, address);

    // Fetch campaign details from the contract
    const details: [string, string, string, string, string] =
      await campaign.methods.getDetails().call();

    return {
      address,
      title: details[0], // Assuming title is the first returned value
      description: details[1], // Assuming description is the second returned value
      minimumContribution: details[2],
      balance: details[3],
      manager: details[4],
    };
  } catch (error) {
    console.error(`Error fetching details for campaign ${address}:`, error);
    return { address, title: 'Error loading campaign' };
  }
}
