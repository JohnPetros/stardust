import type { RankingDTO, RankingUserDTO, RankingWinnerDTO, UserDTO } from '@/@core/dtos'
import { AppError } from '@/@core/errors/global/AppError'
import { RankingPage } from '@/modules/app/components/pages/Ranking'
import { ROUTES } from '@/modules/global/constants'
import { NextClient } from '@/server/client'

type RankingPageData = {
  user: UserDTO
  rankingsWinners: RankingWinnerDTO[]
  rankingUsers: RankingUserDTO[]
  rankings: RankingDTO[]
}

export default async function Ranking() {
  const client = NextClient()

  const response = await client.get<RankingPageData>(ROUTES.server.ranking)

  if (response.isError) response.throwError()

  return (
    <RankingPage
      user={response.body.user}
      rankings={response.body.rankings}
      rankingWinners={response.body.rankingsWinners}
      rankingUsers={response.body.rankingUsers}
    />
  )
}
