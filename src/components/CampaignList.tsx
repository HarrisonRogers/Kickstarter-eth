'use client'

import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Web3Context } from '@/providers/ClientProvider'
import { getDeployedCampaigns } from '@/web3/factory'

export default function CampaignList() {
  const { isConnected, connect } = useContext(Web3Context)
  const [campaigns, setCampaigns] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      if (isConnected) {
        try {
          const deployedCampaigns = await getDeployedCampaigns()
          setCampaigns(deployedCampaigns)
        } catch (error) {
          console.error('Error fetching campaigns:', error)
        }
      }
      setLoading(false)
    }

    fetchCampaigns()
  }, [isConnected])

  if (!isConnected) {
    return (
      <div>
        <p>Please connect your wallet to view campaigns</p>
        <button onClick={connect}>Connect Wallet</button>
      </div>
    )
  }

  if (loading) {
    return <div>Loading campaigns...</div>
  }

  return (
    <div>
      <h1>Active Campaigns</h1>
      <ul>
        {campaigns.map((address) => (
          <li key={address}>{address}</li>
        ))}
      </ul>
    </div>
  )
}
