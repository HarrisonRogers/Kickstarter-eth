import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function Page({ params }: { params: { address: string } }) {
  console.log(params);
  return (
    <>
      <h1>Requests List</h1>
      <Link href={`/campaigns/${params.address}/requests/new`}>
        <Button className="mt-7">Create Request</Button>
      </Link>
    </>
  );
}

export default Page;
