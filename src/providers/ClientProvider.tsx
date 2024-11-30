'use client'

import { createContext, useEffect, useState } from 'react'
import { requestAccounts } from '@/web3/web3'

export const Web3Context = createContext<{
  isConnected: boolean
  connect: () => Promise<void>
}>({
  isConnected: false,
  connect: async () => {},
})

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    const connected = await requestAccounts()
    setIsConnected(connected)
  }

  useEffect(() => {
    // Check initial connection status
    connect()
  }, [])

  return (
    <Web3Context.Provider value={{ isConnected, connect }}>
      {children}
    </Web3Context.Provider>
  )
}
