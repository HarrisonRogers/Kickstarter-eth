'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCampaign } from '@/web3/campaign';
import web3 from '@/web3/web3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Page({ params }: { params: { address: string } }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const campaign = await getCampaign(params.address);

    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();

      const result = await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      if (result) {
        setLoading(false);
        setSuccess(true);
        router.push(`/campaigns/${params.address}/requests`);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setLoading(false);
      setError((error as Error).message);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Create a Request</h1>

      <form className="flex flex-col gap-4 w-full max-w-lg" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            placeholder="Description..."
            className="mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="value">Value in Ether</Label>
          <Input
            placeholder="Eth amount..."
            type="number"
            value={value}
            className="mt-2"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="recipient">
            Recipient {`(make sure this address is correct)`}
          </Label>
          <Input
            placeholder="Recipient address..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-2"
          />
        </div>
        <Button type="submit" className="mt-5" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
        {error && <p className="text-coral">{error}</p>}
        {success && <p className="italic">Request created successfully</p>}
      </form>
    </>
  );
}

export default Page;
