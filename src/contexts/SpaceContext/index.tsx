'use client'

import { createContext, ReactNode } from 'react'

import { useSpaceProvider } from './hooks/useSpaceProvider'
import { SpaceContextValue } from './types/SpaceContextValue'

type SpaceContextProps = {
  children: ReactNode
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children }: SpaceContextProps) {
  const spaceContextValue = useSpaceProvider()

  return (
    <SpaceContext.Provider value={spaceContextValue}>
      {children}
    </SpaceContext.Provider>
  )
}
