'use client';

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import React, { useState } from 'react';
import { RequestProps } from './page';
import web3 from '@/web3/web3';
import { Button } from '@/components/ui/button';
import { getCampaign } from '@/web3/campaign';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type RequestsTableProps = {
  requests: RequestProps[];
  approversCount: string;
  address: string;
};

function RequestsTable({
  requests,
  approversCount,
  address,
}: RequestsTableProps) {
  const router = useRouter();
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);

  const approveRequest = async (requestId: number) => {
    const campaign = await getCampaign(address);
    try {
      setApproveLoading(true);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(requestId)
        .send({ from: accounts[0] });

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setApproveLoading(false);
    }
  };

  const finalizeRequest = async (requestId: number) => {
    const campaign = await getCampaign(address);
    try {
      setFinalizeLoading(true);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(requestId)
        .send({ from: accounts[0] });

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setFinalizeLoading(false);
    }
  };

  return (
    <Table className="mt-7">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Value (ETH)</TableHead>
          <TableHead>Recipient</TableHead>
          <TableHead>Approval Count</TableHead>
          <TableHead>Approve</TableHead>
          <TableHead>Finalize</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request, idx) => {
          const isApproved =
            Number(request.approvalCount) > Number(approversCount) / 2;

          const isFinalized = request.complete;

          return (
            <TableRow
              key={idx}
              className={cn(
                isApproved ? 'bg-blue-100' : '',
                isFinalized ? 'bg-green-100' : ''
              )}
            >
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>
                {web3.utils.fromWei(request.value.toString(), 'ether')}
              </TableCell>
              <TableCell>{request.recipient}</TableCell>
              <TableCell>
                {Number(request.approvalCount)}/{Number(approversCount)}
              </TableCell>
              <TableCell>
                {request.complete ? null : (
                  <Button
                    variant="outline"
                    onClick={() => approveRequest(idx)}
                    disabled={approveLoading}
                  >
                    {approveLoading ? 'Approving...' : 'Approve'}
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {request.complete ? null : (
                  <Button
                    onClick={() => finalizeRequest(idx)}
                    className="disabled:cursor-not-allowed bg-green-500 hover:bg-green-600"
                    disabled={finalizeLoading || !isApproved}
                  >
                    {finalizeLoading ? 'Finalizing...' : 'Finalize'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default RequestsTable;
