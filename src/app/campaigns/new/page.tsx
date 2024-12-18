'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFactory } from '@/web3/factory';
import web3 from '@/web3/web3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function NewPage() {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const factoryInstance = await getFactory();
      const accounts = await web3.eth.getAccounts();

      const result = await factoryInstance.methods
        .createCampaign(minimumContribution)
        .send({
          from: accounts[0],
        });
      if (result) {
        setLoading(false);
        setSuccess(true);
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setLoading(false);
      setError((error as Error).message);
    }
  };

  return (
    <div className="p-4 flex flex-col w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Create New Campaign</h1>

      <div className="flex mt-10 flex-col w-full max-w-lg">
        <form className="space-y-4" onSubmit={handleCreateCampaign}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="minimum-contribution">
              Minimum Contribution (wei)
            </Label>
            <Input
              placeholder="Amount of wei..."
              id="minimum-contribution"
              value={minimumContribution}
              onChange={(e) => setMinimumContribution(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
          {error && <p className="text-coral">{error}</p>}
          {success && <p className="italic">Campaign created successfully</p>}
        </form>
      </div>
    </div>
  );
}

export default NewPage;
