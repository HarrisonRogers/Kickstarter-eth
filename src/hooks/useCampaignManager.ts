'use client';

import { getCampaign } from '@/web3/campaign';
import web3 from '@/web3/web3';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseCampaignManagerProps {
  campaignAddress: string;
  redirectTo?: string;
  shouldRedirect?: boolean;
}

export function useCampaignManager({
  campaignAddress,
  redirectTo,
  shouldRedirect = true,
}: UseCampaignManagerProps) {
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkManager = async () => {
      try {
        const campaign = await getCampaign(campaignAddress);
        const accounts = await web3.eth.getAccounts();
        const currentUserAddress = accounts[0];
        const manager: string = await campaign.methods.manager().call();

        const isManagerResult =
          currentUserAddress?.toLowerCase() === manager?.toLowerCase();

        setIsManager(isManagerResult);

        if (shouldRedirect && !isManagerResult && redirectTo) {
          router.push(redirectTo);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    checkManager();
  }, [campaignAddress, redirectTo, shouldRedirect, router]);

  return { isManager, isLoading, error };
}
