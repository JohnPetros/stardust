'use client'

import { createContext, type ReactNode } from 'react'

import type { PlanetDto } from '@stardust/core/space/entities/dtos'

import { useSpaceProvider, useSpaceContext } from './hooks'
import type { SpaceContextValue } from './types/SpaceContextValue'

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
