import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCampaign } from '@/web3/campaign';
import React from 'react';
import RequestsTable from './requestsTable';

export type RequestProps = {
  description: string;
  value: string;
  recipient: string;
  approvalCount: string;
};

async function Page({ params }: { params: { address: string } }) {
  const campaign = await getCampaign(params.address);

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
      <h1 className="text-2xl font-bold">Requests List</h1>
      <RequestsTable requests={requests} />
      <Link href={`/campaigns/${params.address}/requests/new`}>
        <Button className="mt-7">Create Request</Button>
      </Link>
    </>
  );
}

export default Page;
