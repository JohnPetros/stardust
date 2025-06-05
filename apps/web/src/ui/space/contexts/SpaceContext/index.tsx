'use client'

import { createContext, useEffect, type ReactNode } from 'react'

import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import { Planet } from '@stardust/core/space/entities'

import { useSpaceProvider, useSpaceContext } from './hooks'
import type { SpaceContextValue } from './types/SpaceContextValue'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

type SpaceContextProps = {
  children: ReactNode
  planetsDto: PlanetDto[]
}

export const SpaceContext = createContext({} as SpaceContextValue)

export function SpaceProvider({ children, planetsDto }: SpaceContextProps) {
  const { user, refetchUser } = useAuthContext()
  const spaceContextValue = useSpaceProvider(planetsDto.map(Planet.create), user)

  useEffect(() => {
    refetchUser()
  }, [])

  return (
    <SpaceContext.Provider value={spaceContextValue}>{children}</SpaceContext.Provider>
  )
}

export { useSpaceContext }
