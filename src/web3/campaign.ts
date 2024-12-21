import web3 from './web3';
import Campaign from '../../eth/build/Campaign.json';

export interface CampaignDetails {
  address: string;
  title: string;
  description: string;
  minimumContribution: number;
  balance: number;
  manager: string;
  requestsCount: number;
  approversCount: number;
}

export async function getCampaignDetails(
  address: string
): Promise<CampaignDetails> {
  try {
    const campaign = new web3.eth.Contract(Campaign.abi, address);
    const details: [string, string, number, number, string, number, number] =
      await campaign.methods.getDetails().call();

    // Convert BigInt values to numbers and provide defaults
    return {
      address,
      title: details[0] || 'Untitled Campaign',
      description: details[1] || 'No description available',
      minimumContribution: Number(details[2] || 0),
      balance: Number(details[3] || 0),
      manager: details[4] || '',
      requestsCount: Number(details[5] || 0),
      approversCount: Number(details[6] || 0),
    };
  } catch (error) {
    console.error(`Error fetching details for campaign ${address}:`, error);
    // Return default values if there's an error
    return {
      address,
      title: 'Error loading campaign',
      description: 'Unable to load campaign details',
      minimumContribution: 0,
      balance: 0,
      manager: '',
      requestsCount: 0,
      approversCount: 0,
    };
  }
}

export async function getCampaign(address: string) {
  const abi = Campaign.abi;
  const contract = new web3.eth.Contract(abi, address);
  return contract;
}
