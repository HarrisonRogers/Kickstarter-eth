'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCampaign } from '@/web3/campaign';
import web3 from '@/web3/web3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCampaignManager } from '@/hooks/useCampaignManager';

const schema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  value: z
    .string()
    .min(0.0001, { message: 'Value is required' })
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0.0001, {
      message: 'Value must be at least 0.0001 ETH',
    }),
  recipient: z.string().min(1, { message: 'Recipient is required' }),
});

type RequestFormData = z.infer<typeof schema>;

function Page({ params }: { params: { address: string } }) {
  const [error, setError] = useState('');
  const router = useRouter();
  const { isManager } = useCampaignManager({
    campaignAddress: params.address,
    redirectTo: `/campaigns/${params.address}/requests`,
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(schema),
  });

  if (!isManager) {
    return <div>You are not the manager of this campaign</div>;
  }

  const onSubmit = async (data: RequestFormData) => {
    const campaign = await getCampaign(params.address);

    try {
      const accounts = await web3.eth.getAccounts();

      const result = await campaign.methods
        .createRequest(
          data.description,
          web3.utils.toWei(data.value, 'ether'),
          data.recipient
        )
        .send({ from: accounts[0] });

      if (result) {
        router.push(`/campaigns/${params.address}/requests`);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setError((error as Error).message);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Create a Request</h1>

      <form
        className="flex flex-col gap-4 w-full max-w-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            placeholder="Description..."
            className="mt-2"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="value">Value in Ether (0.0001 ETH minimum)</Label>
          <Input
            placeholder="Eth amount..."
            type="number"
            step="0.0001"
            {...register('value')}
            className="mt-2"
          />
          {errors.value && (
            <p className="text-red-500 text-sm">{errors.value.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="recipient">
            Recipient {`(make sure this address is correct)`}
          </Label>
          <Input
            placeholder="Recipient address..."
            {...register('recipient')}
            className="mt-2"
          />
          {errors.recipient && (
            <p className="text-red-500 text-sm">{errors.recipient.message}</p>
          )}
        </div>
        <Button type="submit" className="mt-5" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
        {error && <p className="text-coral">{error}</p>}
      </form>
    </>
  );
}

export default Page;
