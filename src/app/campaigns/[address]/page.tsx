import Container from '@/components/ui/container'
import React from 'react'
import { getCampaign } from '@/web3/campaign'

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

async function Page({ params }: { params: PageProps }) {
  const { address } = params
  let summary: CampaignSummary | null = null

  try {
    const campaign = await getCampaign(address)
    const response: [string, string, string, string, string] =
      await campaign.methods.getSummary().call()

    summary = {
      minimumContribution: response[0],
      balance: response[1],
      requestsCount: response[2],
      approversCount: response[3],
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

  return (
    <Container>
      <div className="p-4 flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl font-bold">{address} Campaign</h1>

        <div className="mt-4 w-full max-w-2xl space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Campaign Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Minimum Contribution:</span>{' '}
                {summary.minimumContribution || '0'} wei
              </p>
              <p>
                <span className="font-medium">Campaign Balance:</span>{' '}
                {summary.balance || '0'} wei
              </p>
              <p>
                <span className="font-medium">Number of Requests:</span>{' '}
                {summary.requestsCount || '0'}
              </p>
              <p>
                <span className="font-medium">Number of Contributors:</span>{' '}
                {summary.approversCount || '0'}
              </p>
              <p>
                <span className="font-medium">Manager Address:</span>{' '}
                {summary.manager}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Page
