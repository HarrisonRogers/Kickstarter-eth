'use client'

import { getDeployedCampaigns } from '@/web3/factory'
import { useEffect, useState } from 'react'

export default function Home() {
  const [campaigns, setCampaigns] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      const deployedCampaigns = await getDeployedCampaigns()
      setCampaigns(deployedCampaigns)
      setLoading(false)
    }
    fetchCampaigns()
  }, [])

  if (loading) {
    return <div>Sign into MetaMask to view campaigns...</div>
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
