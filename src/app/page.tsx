'use client'

import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container'
import LinkComponent from '@/components/ui/links/link'
import { getDeployedCampaigns } from '@/web3/factory'
import { useEffect, useState } from 'react'

export default function Home() {
  const [campaigns, setCampaigns] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const deployedCampaigns = await getDeployedCampaigns()
        setCampaigns(deployedCampaigns)
      } catch (err) {
        console.error('Failed to fetch campaigns:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this feature')
      return
    }

    setError(null)

    try {
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      // Refresh campaigns after connection
      const deployedCampaigns = await getDeployedCampaigns()
      setCampaigns(deployedCampaigns)
    } catch (err) {
      console.error('Connection error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to connect to MetaMask')
      }
    }
  }

  return (
    <Container>
      <div className="p-4 flex justify-center items-center w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <p>Please connect your wallet to view campaigns</p>
            <Button onClick={connectWallet}>Connect MetaMask</Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-center items-center mb-6">
              <h1 className="text-2xl font-bold">Active Campaigns</h1>
            </div>

            {campaigns.length > 0 ? (
              <ul className="space-y-2">
                {campaigns.map((address) => (
                  <li
                    key={address}
                    className="border p-4 rounded flex flex-col"
                  >
                    {address}
                    <LinkComponent href={`/campaigns/${address}`}>
                      View
                    </LinkComponent>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active campaigns found or not connected to MetaMask</p>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}
