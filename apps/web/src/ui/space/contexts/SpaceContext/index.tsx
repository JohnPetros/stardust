'use client'

import { createContext, type ReactNode } from 'react'

import { useSpaceProvider, useSpaceContext } from './hooks'
import type { SpaceContextValue } from './types/SpaceContextValue'
import type { PlanetDto } from '#dtos'

type SpaceContextProps = {
  children: ReactNode
  planetsDto: PlanetDto[]
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children, planetsDto }: SpaceContextProps) {
  const spaceContextValue = useSpaceProvider(planetsDto)

  return (
    <SpaceContext.Provider value={spaceContextValue}>{children}</SpaceContext.Provider>
  )
}

export { useSpaceContext }
