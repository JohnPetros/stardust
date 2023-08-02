'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRanking } from '@/hooks/useRanking'
import { useRankedUsers } from '@/hooks/useRankedUsers'

import { Loading } from '@/app/components/Loading'
import { RankedUsersList } from './components/RankedUsersList'
import { BadgesList } from './components/BadgesList'

import dayjs from 'dayjs'

const today = dayjs().day()
const sunday = 0
const restDays = today === sunday ? 7 : 7 - today

export default function Ranking() {
  const { user } = useAuth()
  const { ranking: currentRanking, rankings } = useRanking(
    user?.ranking_id,
    true
  )

  const { users } = useRankedUsers(user?.ranking_id ?? '')

  const [isFirstRendering, setIsFirstRendering] = useState(true)

  const badgesListRef = useRef<HTMLDivElement>(null)

  console.log(users)
  console.log(rankings)


  useEffect(() => {
    if (!rankings?.length && badgesListRef.current && !isFirstRendering) return

    const timer = setTimeout(() => {
      setIsFirstRendering(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [rankings, badgesListRef])

  return (
    <div className="mt-10 w-screen max-w-5xl md:mx-auto pb-6">
      {isFirstRendering && <Loading isSmall={false} />}

      {user && users && rankings && currentRanking && (
        <>
          <BadgesList
            rankings={rankings}
            currentRanking={currentRanking}
          />

          <div className="flex flex-col items-center justify-center gap-3 mt-6">
            <p className="font-medium text-gray-100 text-center">
              Os 5 primeiros avançam para o próximo ranking
            </p>

            <strong className="text-center text-green-400">
              {restDays + (restDays === 1 ? ' dia' : ' dias')}
            </strong>
          </div>

          <RankedUsersList users={users} authUserId={user.id} />
        </>
      )}
    </div>
  )
}
