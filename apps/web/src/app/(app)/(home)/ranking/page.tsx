import type { RankingUserDto, TierDto } from '@stardust/core/ranking/dtos'

import { ROUTES } from '@/constants'
import { NextApiClient } from '@/api/next/NextApiClient'
import { RankingPage } from '@/ui/ranking/widgets/pages/Ranking'
import { RankingProvider } from '@/ui/ranking/contexts/RankingContext'

type RankingPageData = {
  tiers: TierDto[]
  rankingUsers: RankingUserDto[]
}

export default async function Ranking() {
  const apiClient = NextApiClient({ isCacheEnable: false })
  const response = await apiClient.get<RankingPageData>(ROUTES.api.ranking.current)
  if (response.isFailure) response.throwError()

  return (
    <RankingProvider
      tiers={response.body.tiers}
      rankingUsers={response.body.rankingUsers}
    >
      <RankingPage />
    </RankingProvider>
  )
}
