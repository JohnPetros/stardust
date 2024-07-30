'use client'

import { Datetime } from '@/@core/lib/datetime'
import { Icon } from '@/modules/global/components/shared/Icon'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { TiersList } from './TiersList'
import { RankingUsersList } from './RankingUsersList'
import { RankingResult } from './RankingResult'

const DAYS_COUNT_TO_SUNDAY = new Datetime().getDaysCountToSunday()

export function RankingPage() {
  const { user } = useAuthContext()

  if (user)
    return (
      <div className='mt-6 w-screen max-w-5xl px-6 pb-6 md:mx-auto md:px-0'>
        <>
          {user.canSeeRankingResult.isTrue ? (
            <RankingResult />
          ) : (
            <>
              <TiersList />

              <div className='mt-6 flex flex-col items-center justify-center gap-3'>
                <p className='text-center font-medium text-gray-100'>
                  Os 5 primeiros avançam para o próximo ranking.
                </p>

                <strong className='flex items-center gap-2 text-center text-green-400'>
                  <Icon name='clock' size={20} />
                  {DAYS_COUNT_TO_SUNDAY +
                    (DAYS_COUNT_TO_SUNDAY === 1 ? ' dia restante' : ' dias restantes')}
                </strong>
              </div>

              <RankingUsersList />
            </>
          )}
        </>
      </div>
    )
}
