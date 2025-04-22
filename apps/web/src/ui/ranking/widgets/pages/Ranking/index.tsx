'use client'

import { Datetime } from '@stardust/core/global/libs'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { TiersList } from './TiersList'
import { RankingUsersList } from './RankingUsersList'
import { RankingResult } from './RankingResult'

const DAYS_COUNT_TO_SUNDAY = new Datetime(new Date()).getDaysCountToSunday()

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
                  Os 5 primeiros avançam para o próximo tier.
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
