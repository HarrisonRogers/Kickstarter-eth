'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFactory } from '@/web3/factory';
import web3 from '@/web3/web3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  campaignTitle: z.string().min(1, { message: 'Campaign title is required' }),
  campaignDescription: z
    .string()
    .min(1, { message: 'Campaign description is required' }),
  minimumContribution: z
    .string()
    .min(1, { message: 'Minimum contribution is required' })
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0.0001, {
      message: 'Minimum contribution must be at least 0.0001 ETH',
    }),
});

type CampaignFormData = z.infer<typeof schema>;

function NewPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateCampaign = async (data: CampaignFormData) => {
    try {
      const factoryInstance = await getFactory();
      const accounts = await web3.eth.getAccounts();
      const minimumContributionInWei = web3.utils.toWei(
        data.minimumContribution,
        'ether'
      );

      const result = await factoryInstance.methods
        .createCampaign(
          minimumContributionInWei,
          data.campaignTitle,
          data.campaignDescription
        )
        .send({
          from: accounts[0],
        });
      if (result) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError((error as Error).message);
    }
  };

  return (
    <div className="p-4 flex flex-col w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Create New Campaign</h1>

      <div className="flex mt-10 flex-col w-full max-w-lg">
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleCreateCampaign)}
        >
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <Label htmlFor="campaign-title">Campaign Title</Label>
              <Input
                required
                placeholder="Campaign Title"
                id="campaign-title"
                {...register('campaignTitle')}
              />
              {errors.campaignTitle && (
                <p className="text-red-500 text-sm">
                  {errors.campaignTitle.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="campaign-description">Campaign Description</Label>
              <Textarea
                required
                placeholder="Campaign Description"
                id="campaign-description"
                {...register('campaignDescription')}
              />
              {errors.campaignDescription && (
                <p className="text-red-500 text-sm">
                  {errors.campaignDescription.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="minimum-contribution">
                Minimum Contribution (0.0001 ETH)
              </Label>
              <Input
                required
                placeholder="Amount of eth..."
                id="minimum-contribution"
                {...register('minimumContribution')}
              />
              {errors.minimumContribution && (
                <p className="text-red-500 text-sm">
                  {errors.minimumContribution.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
          {error && <p className="text-coral">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default NewPage;
