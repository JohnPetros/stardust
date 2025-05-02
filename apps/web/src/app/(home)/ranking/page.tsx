import type { RankingUserDto, TierDto } from '@stardust/core/ranking/dtos'

import { ROUTES } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { RankingPage } from '@/ui/ranking/widgets/pages/Ranking'
import { RankingProvider } from '@/ui/ranking/contexts/RankingContext'

export default async function Ranking() {
  const apiClientWithCache = NextRestClient({ isCacheEnable: true })
  const apiClientWithoutCache = NextRestClient({ isCacheEnable: false })

  const [tiersResponse, rankingUsersResponse] = await Promise.all([
    apiClientWithCache.get<TierDto[]>(ROUTES.api.ranking.tiers),
    apiClientWithoutCache.get<RankingUserDto[]>(ROUTES.api.ranking.current),
  ])

  return (
    <RankingProvider tiers={tiersResponse.body} rankingUsers={rankingUsersResponse.body}>
      <RankingPage />
    </RankingProvider>
  )
}
