'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCampaign } from '@/web3/campaign';
import web3 from '@/web3/web3';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  amount: z
    .string()
    .min(0.0001, { message: 'Amount is required' })
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0.0001, {
      message: 'Amount must be at least 0.0001 ETH',
    }),
});

type ContributeFormData = z.infer<typeof schema>;

function ContributeForm({ address }: { address: string }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ContributeFormData>({
    resolver: zodResolver(schema),
  });

  const handleContribute = async (data: ContributeFormData) => {
    const campaign = await getCampaign(address);

    try {
      const accounts = await web3.eth.requestAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(data.amount, 'ether'),
      });
      router.refresh();
      setSuccess(true);
    } catch (error) {
      console.error('Error contributing to campaign:', error);
      setError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleContribute)}>
      <Label htmlFor="amount">Amount to contribute (ETH)</Label>
      <Input
        id="amount"
        type="number"
        step="0.0001"
        placeholder="in Eth..."
        className="mb-1 w-full"
        {...register('amount')}
      />
      {errors.amount && (
        <p className="text-red-500 text-sm ">{errors.amount.message}</p>
      )}
      <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
        {isSubmitting ? 'Contributing...' : 'Contribute'}
      </Button>
      {error && <p className="text-coral">{error}</p>}
      {success && <p className="italic mt-4">Contribution successful</p>}
    </form>
  );
}

export default ContributeForm;
