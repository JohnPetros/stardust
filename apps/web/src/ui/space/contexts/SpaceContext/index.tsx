'use client'

import { createContext, useEffect, useMemo, type ReactNode } from 'react'

import type { CurrentGalaxyDto, PlanetDto } from '@stardust/core/space/entities/dtos'
import { Planet } from '@stardust/core/space/entities'

import type { SpaceContextValue } from './types/SpaceContextValue'
import { useSpaceContextProvider } from './useSpaceContextProvider'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

type SpaceContextProps = {
  children: ReactNode
  planetsDto: PlanetDto[]
  currentGalaxy: CurrentGalaxyDto
}

export const SpaceContext = createContext<SpaceContextValue | undefined>(undefined)

export function SpaceProvider({
  children,
  planetsDto,
  currentGalaxy,
}: SpaceContextProps) {
  const { user, refetchUser } = useAuthContext()
  const planets = useMemo(() => planetsDto.map(Planet.create), [planetsDto])
  const spaceContextValue = useSpaceContextProvider(
    planets,
    user,
    currentGalaxy,
    refetchUser,
  )

  useEffect(() => {
    refetchUser()
  }, [])

  return (
    <SpaceContext.Provider value={spaceContextValue}>{children}</SpaceContext.Provider>
  )
}
