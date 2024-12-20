import { Web3BaseProvider } from 'web3-types';

declare global {
  interface Window {
    ethereum?: Web3BaseProvider & {
      request: (args: { method: string }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
  }
  type Campaign = {
    address: string;
    title: string;
    description?: string;
    minimumContribution?: string;
    balance?: string;
    manager?: string;
  };
}

export {};
