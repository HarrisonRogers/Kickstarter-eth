import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import React from 'react';
import { RequestProps } from './page';
import web3 from '@/web3/web3';
import { Button } from '@/components/ui/button';

function RequestsTable({ requests }: { requests: RequestProps[] }) {
  return (
    <Table className="mt-7">
      <TableHeader>
        <TableRow>
          <TableHead>Number</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Value (ETH)</TableHead>
          <TableHead>Recipient</TableHead>
          <TableHead>Approval Count</TableHead>
          <TableHead>Approve</TableHead>
          <TableHead>Finalize</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request, idx) => (
          <TableRow key={idx}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{request.description}</TableCell>
            <TableCell>
              {web3.utils.fromWei(request.value.toString(), 'ether')}
            </TableCell>
            <TableCell>{request.recipient}</TableCell>
            <TableCell>{Number(request.approvalCount)}</TableCell>
            <TableCell>
              <Button>Approve</Button>
            </TableCell>
            <TableCell>
              <Button>Finalize</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default RequestsTable;
