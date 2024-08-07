'use client'

import { createContext, type ReactNode } from 'react'

import type { RankingUserDTO, TierDTO } from '@/@core/dtos'
import { Tier } from '@/@core/domain/entities'
import type { RankingContextValue } from './types/RankingContextValue'
import { useRankingProvider } from './hooks/useRankingProvider'
import { useRankingContext } from './hooks/useRankingContext'

type RankingContextProps = {
  children: ReactNode
  tiers: TierDTO[]
  rankingUsers: RankingUserDTO[]
}

export const RankingContext = createContext({} as RankingContextValue)

export function RankingProvider({ children, tiers, rankingUsers }: RankingContextProps) {
  const { ranking } = useRankingProvider(rankingUsers)

  return (
    <RankingContext.Provider
      value={{
        ranking,
        tiers: tiers.map(Tier.create),
      }}
    >
      {children}
    </RankingContext.Provider>
  )
}

export { useRankingContext }