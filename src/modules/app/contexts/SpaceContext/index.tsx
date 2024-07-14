'use client'

import { createContext, type ReactNode } from 'react'

import { useSpaceProvider, useSpaceContext } from './hooks'
import type { SpaceContextValue } from './types/SpaceContextValue'
import type { PlanetDTO } from '@/@core/dtos'

type SpaceContextProps = {
  children: ReactNode
  planetsDTO: PlanetDTO[]
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children, planetsDTO }: SpaceContextProps) {
  const spaceContextValue = useSpaceProvider(planetsDTO)

  return (
    <SpaceContext.Provider value={spaceContextValue}>{children}</SpaceContext.Provider>
  )
}

export { useSpaceContext }
