import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCampaign } from '@/web3/campaign';
import React from 'react';
import RequestsTable from './requestsTable';
import BackButton from '@/components/ui/backButton';

export type RequestProps = {
  description: string;
  value: string;
  recipient: string;
  approvalCount: string;
};

async function Page({ params }: { params: { address: string } }) {
  const campaign = await getCampaign(params.address);

  try {
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const requests = await Promise.all(
      Array(requestsCount)
        .fill()
        .map(async (_, i) => {
          const request = await campaign.methods.requests(i).call();
          return request as unknown as RequestProps;
        })
    );

    return (
      <>
        <div className="flex relative justify-center gap-4 mb-4 w-full">
          <BackButton
            label="Campaign"
            className="self-center absolute left-0"
          />
          <h1 className="text-2xl text-center self-center font-bold">
            Requests List
          </h1>
        </div>
        <RequestsTable requests={requests} />
        <Link href={`/campaigns/${params.address}/requests/new`}>
          <Button className="mt-7">Create Request</Button>
        </Link>
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Error fetching campaign requests</h1>
        <p className="text-lg my-4 text-gray-500">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <BackButton label="Back to Campaign" />
      </div>
    );
  }
}

export default Page;
