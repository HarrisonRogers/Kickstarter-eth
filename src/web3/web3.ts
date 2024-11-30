import Web3 from 'web3'
import 'dotenv/config'
import { Web3BaseProvider } from 'web3-types'

let web3: Web3

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // In browser and metamask is running
  window.ethereum.request({ method: 'eth_requestAccounts' })
  web3 = new Web3(window.ethereum as Web3BaseProvider)
} else {
  // In server or metamask is not running
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_INFURA_ENDPOINT as string
  )
  web3 = new Web3(provider)
}

export default web3
