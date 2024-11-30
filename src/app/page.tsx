import CampaignList from '@/components/CampaignList'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading campaigns...</div>}>
      <CampaignList />
    </Suspense>
  )
}
