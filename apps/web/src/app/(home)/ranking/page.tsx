import type { RankingUserDto, TierDto } from '@stardust/core/ranking/entities/dtos'

import { ROUTES } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { RankingPage } from '@/ui/ranking/widgets/pages/Ranking'
import { RankingProvider } from '@/ui/ranking/contexts/RankingContext'

const Ranking = async () => {
  const apiClientWithCache = NextRestClient({ isCacheEnabled: true })
  const apiClientWithoutCache = NextRestClient({ isCacheEnabled: false })

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

export default Ranking
