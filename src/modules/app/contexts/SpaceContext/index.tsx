'use client'

import { createContext, type ReactNode } from 'react'

import { useSpaceProvider, useSpaceContext } from './hooks'
import type { SpaceContextValue } from './types/SpaceContextValue'
import type { PlanetDTO } from '@/@core/dtos'
import { BuildSpaceUseCase } from '@/@core/use-cases/planets'

type SpaceContextProps = {
  children: ReactNode
  planetsDTO: PlanetDTO[]
  userUnlockedStarsIds: string[]
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({
  children,
  planetsDTO,
  userUnlockedStarsIds,
}: SpaceContextProps) {
  const buildSpaceUseCase = new BuildSpaceUseCase()
  const space = buildSpaceUseCase.do({ planetsDTO, userUnlockedStarsIds })

  const spaceContextValue = useSpaceProvider(space)

  return (
    <SpaceContext.Provider value={spaceContextValue}>{children}</SpaceContext.Provider>
  )
}

export { useSpaceContext }
