'use client'

import type { RankingDTO, RankingUserDTO, RankingWinnerDTO, UserDTO } from '@/@core/dtos'
import { Datetime } from '@/@core/lib/datetime'
import { useRankingPage } from './useRankingPage'
import { TiersList } from './TiersList'
import { RankingWinnerUsersList } from './RankingWinnersList'
import { RankingUsersList } from './RankingUsersList'

const DAYS_COUNT_TO_SUNDAY = new Datetime().getDaysCountToSunday()

type RankingPageProps = {
  user: UserDTO
  rankings: RankingDTO[]
  rankingUsers: RankingUserDTO[]
  rankingWinners: RankingWinnerDTO[]
}

export function RankingPage({
  user,
  rankings,
  rankingUsers,
  rankingWinners,
}: RankingPageProps) {
  const { winners, handleHideWinners } = useRankingPage(user, rankingWinners)

  return (
    <div className='mt-6 w-screen max-w-5xl px-6 pb-6 md:mx-auto md:px-0'>
      <>
        {winners.length > 0 ? (
          <RankingWinnerUsersList winners={winners} onHideWinners={handleHideWinners} />
        ) : (
          <>
            <TiersList rankings={rankings} />

            <div className='mt-6 flex flex-col items-center justify-center gap-3'>
              <p className='text-center font-medium text-gray-100'>
                Os 5 primeiros avançam para o próximo ranking.
              </p>

              <strong className='text-center text-green-400'>
                {DAYS_COUNT_TO_SUNDAY + (DAYS_COUNT_TO_SUNDAY === 1 ? ' dia' : ' dias')}
              </strong>
            </div>

            <RankingUsersList rankingUsers={rankingUsers} />
          </>
        )}
      </>
    </div>
  )
}
