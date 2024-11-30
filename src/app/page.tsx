import React from 'react'
import factory from '../web3/factory'

async function Home() {
  const factoryInstance = await factory
  if (!factoryInstance) {
    throw new Error('Factory not initialized')
  }

  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call()
  console.log(campaigns)

  return <div>Campaigns</div>
}

export default Home
