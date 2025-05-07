'use client'

import { useEffect, useState } from 'react'

import type { RankingUserDto, TierDto } from '@stardust/core/ranking/entities/dtos'
import { Ranking } from '@stardust/core/ranking/structures'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Tier } from '@stardust/core/ranking/entities'

export function useRankingProvider(rankingUsers: RankingUserDto[], tiers: TierDto[]) {
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const { user } = useAuthContext()

  useEffect(() => {
    setRanking(Ranking.create(rankingUsers))
  }, [rankingUsers])

  const userTier = tiers.find((tier) => tier.id === user?.tier.id)

  return {
    ranking,
    userTier: userTier ? Tier.create(userTier) : null,
  }
}
