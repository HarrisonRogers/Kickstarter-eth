import Web3 from 'web3'

let web3: Web3

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.ethereum)

  // Add event listeners for account changes and network changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload()
  })

  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_INFURA_ENDPOINT as string
  )
  web3 = new Web3(provider)
}

// Separate the requestAccounts function as a named export
export const requestAccounts = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      return true
    } catch (error) {
      console.error('User denied account access:', error)
      return false
    }
  }
  return false
}

export default web3
