import Web3 from 'web3'

// Assumption that the browser has metamask installed
let web3

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  window.ethereum.request({ method: 'eth_requestAccounts' })
  web3 = new Web3(window.ethereum)
} else {
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_INFURA_ENDPOINT
  )
  web3 = new Web3(provider)
}

export default web3
