'use client'

import { createContext, type ReactNode } from 'react'

import type { RankingUserDto, TierDto } from '@stardust/core/ranking/entities/dtos'
import { Tier } from '@stardust/core/ranking/entities'

import type { RankingContextValue } from './types/RankingContextValue'
import { useRankingProvider } from './hooks/useRankingProvider'
import { useRankingContext } from './hooks/useRankingContext'

type RankingContextProps = {
  children: ReactNode
  tiers: TierDto[]
  rankingUsers: RankingUserDto[]
}

export const RankingContext = createContext({} as RankingContextValue)

export function RankingProvider({ children, tiers, rankingUsers }: RankingContextProps) {
  const { ranking, userTier } = useRankingProvider(rankingUsers, tiers)

  return (
    <RankingContext.Provider
      value={{
        ranking,
        tiers: tiers.map(Tier.create),
        userTier,
      }}
    >
      {children}
    </RankingContext.Provider>
  )
}

export { useRankingContext }
