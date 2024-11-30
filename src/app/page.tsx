'use client'

import React, { useEffect } from 'react'
import factory from '../web3/factory'

function Home() {
  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await (await factory)!.methods
        .getDeployedCampaigns()
        .call()
      console.log(campaigns)
    }

    fetchCampaigns()
  }, [])

  return <div>Campaigns</div>
}

export default Home
