import web3 from './web3';
import Campaign from '../../eth/build/Campaign.json';

export async function getCampaign(address: string) {
  const abi = Campaign.abi;
  const contract = new web3.eth.Contract(abi, address);
  return contract;
}
