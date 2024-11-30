import { Web3BaseProvider } from 'web3-types'

declare global {
  interface Window {
    ethereum?: Web3BaseProvider & {
      request: (args: { method: string }) => Promise<string[]>
      isMetaMask?: boolean
    }
  }
}

export {}
