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
  complete: boolean;
};

async function Page({ params }: { params: { address: string } }) {
  const campaign = await getCampaign(params.address);

  try {
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount: string = await campaign.methods
      .approversCount()
      .call();
    const requests = await Promise.all(
      Array(Number(requestsCount))
        .fill(0)
        .map(async (_, i) => {
          const request: RequestProps = await campaign.methods
            .requests(i)
            .call();
          return request;
        })
    );

    return (
      <>
        <div className="flex relative justify-center gap-4 mb-4 w-full">
          <BackButton
            href={`/campaigns/${params.address}`}
            label="Campaign"
            className="self-center absolute left-0"
          />
          <h1 className="text-2xl text-center self-center font-bold">
            Requests List
          </h1>
        </div>
        <RequestsTable
          requests={requests}
          approversCount={approversCount}
          address={params.address}
        />
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
        <Link href={`/campaigns/${params.address}/requests/new`}>
          <Button className="mt-2 mb-4">Create Request</Button>
        </Link>
        <BackButton
          label="Back to Campaign"
          href={`/campaigns/${params.address}`}
        />
      </div>
    );
  }
}

export default Page;
