import type { RankingUserDto, TierDto } from '#dtos'
import { RankingPage } from '@/ui/ranking/widgets/pages/Ranking'
import { RankingProvider } from '@/ui/ranking/contexts/RankingContext'
import { ROUTES } from '@/ui/global/constants'
import { NextClient } from '@/infra/api/next/apiClient'

type RankingPageData = {
  tiers: TierDto[]
  rankingUsers: RankingUserDto[]
}

export default async function Ranking() {
  const client = NextClient()

  const response = await client.get<RankingPageData>(ROUTES.server.ranking)

  if (response.isError) response.throwError()

  return (
    <RankingProvider
      tiers={response.body.tiers}
      rankingUsers={response.body.rankingUsers}
    >
      <RankingPage />
    </RankingProvider>
  )
}
