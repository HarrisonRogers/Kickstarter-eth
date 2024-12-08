import Container from '@/components/ui/container'
import React from 'react'

type PageProps = {
  address: string
}

function Page({ params }: { params: PageProps }) {
  const { address } = params

  return (
    <Container>
      <div className="p-4 flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl font-bold">{address} Campaign</h1>
      </div>
    </Container>
  )
}

export default Page
