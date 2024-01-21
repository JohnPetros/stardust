'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

const ClientContext = createContext({ isClient: false })

type ClientContextValue = {
  isClient: boolean
}

type ClientProviderProps = {
  children: ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  const value: ClientContextValue = { isClient }

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  )
}

export function useClientContext() {
  const context = useContext(ClientContext)

  if (!context) {
    throw new Error('useClientContext must be used inside ClientProvider')
  }

  return context
}
