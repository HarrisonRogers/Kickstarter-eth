'use client'

import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

function NewPage() {
  const [minimumContribution, setMinimumContribution] = useState('')

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(minimumContribution)
  }

  return (
    <Container>
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
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </div>
      </div>
    </Container>
  )
}

export default NewPage
