import type { RankingUserDTO, TierDTO } from '@/@core/dtos'
import { RankingPage } from '@/modules/app/components/pages/Ranking'
import { RankingProvider } from '@/modules/app/contexts/RankingContext'
import { ROUTES } from '@/modules/global/constants'
import { NextClient } from '@/server/client'

type RankingPageData = {
  tiers: TierDTO[]
  rankingUsers: RankingUserDTO[]
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
