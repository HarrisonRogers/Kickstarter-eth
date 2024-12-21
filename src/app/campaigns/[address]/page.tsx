import Container from '@/components/ui/container';
import React from 'react';
import { CampaignDetails, getCampaignDetails } from '@/web3/campaign';
import { Card } from '@/components/ui/card';
import web3 from '@/web3/web3';
import ContributeForm from '@/components/contributeForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/backButton';

type PageProps = {
  address: string;
};

type CampaignCard = {
  title: string;
  value: string | number;
  description: string;
};

async function Page({ params }: { params: PageProps }) {
  const { address } = params;
  let summary: CampaignDetails | null = null;

  try {
    const campaign = await getCampaignDetails(address);

    summary = {
      minimumContribution: campaign.minimumContribution,
      balance: campaign.balance,
      requestsCount: campaign.requestsCount,
      approversCount: campaign.approversCount,
      manager: campaign.manager,
      title: campaign.title,
      description: campaign.description,
      address: address,
    };
  } catch (error) {
    console.error('Error fetching campaign:', error);
  }

  console.log(summary || 'No summary');

  if (!summary) {
    return (
      <Container>
        <div className="p-4 flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl font-bold">Error loading campaign</h1>
        </div>
      </Container>
    );
  }

  // Create cards data
  const campaignCards: CampaignCard[] = [
    {
      title: 'Manager Address',
      value: summary.manager || 'Not available',
      description: 'Eth address of the campaign manager',
    },
    {
      title: 'Minimum Contribution',
      value: `${web3.utils.fromWei(
        (summary.minimumContribution || 0).toString(),
        'ether'
      )} ETH`,
      description: 'Minimum amount needed to contribute to this campaign',
    },
    {
      title: 'Campaign Balance',
      value: `${
        summary.balance
          ? web3.utils.fromWei(summary.balance.toString(), 'ether')
          : '0'
      } ETH`,
      description: 'Current balance of the campaign',
    },
    {
      title: 'Number of Requests',
      value: summary.requestsCount || 0,
      description: 'Number of spending requests made by the manager',
    },
    {
      title: 'Contributors',
      value: summary.approversCount || 0,
      description: 'Number of people who have donated to this campaign',
    },
  ];

  return (
    <div className="p-8 flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <BackButton label="Campaigns" />
          <h1 className="text-3xl font-bold">{summary.title}</h1>
          <p className="text-md mt-2">Campaign Address: {address}</p>
          <p className="text-sm text-gray-500 mt-2">{summary.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 w-full">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {campaignCards.map((card, index) => (
                <Card
                  key={index}
                  className="w-full hover:scale-105 transition-all duration-300"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                    <p className="text-lg mb-2 break-all">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href={`/campaigns/${address}/requests`}>
                <Button size="lg">View Requests</Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ContributeForm address={address} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
