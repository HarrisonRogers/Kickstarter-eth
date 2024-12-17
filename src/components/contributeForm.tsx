'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCampaign } from '@/web3/campaign';
import web3 from '@/web3/web3';

function ContributeForm({ address }: { address: string }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleContribute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const campaign = await getCampaign(address);

    try {
      const accounts = await web3.eth.requestAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether'),
      });
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error contributing to campaign:', error);
      setError('Failed to contribute to campaign');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleContribute}>
      <Label htmlFor="amount">Amount to contribute</Label>
      <Input
        id="amount"
        type="number"
        placeholder="in Eth"
        className="mb-4 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Contributing...' : 'Contribute'}
      </Button>
      {error && <p className="text-coral">{error}</p>}
      {success && <p className="italic mt-4">Contribution successful</p>}
    </form>
  );
}

export default ContributeForm;
