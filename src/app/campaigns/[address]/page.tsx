import Container from '@/components/ui/container'
import React from 'react'
import { getCampaign } from '@/web3/campaign'
import { Card } from '@/components/ui/card'
import web3 from '@/web3/web3'

type PageProps = {
  address: string
}

type CampaignSummary = {
  minimumContribution: string
  balance: string
  requestsCount: string
  approversCount: string
  manager: string
}

type CampaignCard = {
  title: string
  value: string
  description: string
}

async function Page({ params }: { params: PageProps }) {
  const { address } = params
  let summary: CampaignSummary | null = null

  try {
    const campaign = await getCampaign(address)
    const response: [string, string, string, string, string] =
      await campaign.methods.getSummary().call()

    summary = {
      minimumContribution: String(response[0]),
      balance: String(response[1]),
      requestsCount: String(response[2]),
      approversCount: String(response[3]),
      manager: response[4],
    }
  } catch (error) {
    console.error('Error fetching campaign:', error)
  }

  if (!summary) {
    return (
      <Container>
        <div className="p-4 flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl font-bold">Error loading campaign</h1>
        </div>
      </Container>
    )
  }

  console.log(summary.minimumContribution)

  // Create cards data
  const campaignCards: CampaignCard[] = [
    {
      title: 'Manager Address',
      value: summary.manager,
      description: 'Eth address of the campaign manager',
    },
    {
      title: 'Minimum Contribution',
      value: `${web3.utils.fromWei(summary.minimumContribution, 'ether')} ETH`,
      description: 'Minimum amount needed to contribute to this campaign',
    },
    {
      title: 'Campaign Balance',
      value: `${
        Number(summary.balance) > Number(summary.minimumContribution)
          ? web3.utils.fromWei(summary.balance, 'ether')
          : '0'
      } ETH`,
      description: 'Current balance of the campaign',
    },
    {
      title: 'Number of Requests',
      value: summary.requestsCount || '0',
      description: 'Number of spending requests made by the manager',
    },
    {
      title: 'Contributors',
      value: summary.approversCount || '0',
      description: 'Number of people who have donated to this campaign',
    },
  ]

  return (
    <Container>
      <div className="p-4 flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl font-bold mb-6">{address} Campaign</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl">
          {campaignCards.map((card, index) => (
            <Card key={index} className="w-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-lg mb-2 break-all">{card.value}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  )
}

export default Page
