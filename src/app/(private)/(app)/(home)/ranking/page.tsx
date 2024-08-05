import type { RankingUserDTO, TierDTO } from '@/@core/dtos'
import { RankingPage } from '@/ui/app/components/pages/Ranking'
import { RankingProvider } from '@/ui/app/contexts/RankingContext'
import { ROUTES } from '@/ui/global/constants'
import { NextClient } from '@/server/NextApiClient'

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
