'use client'

import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

import { BadgesList } from './components/BadgesList'
import { RankedUsersList } from './components/RankedUsersList'
import { WinnersList } from './components/WinnersList'

import type { Ranking } from '@/@types/Ranking'
import type { Winner } from '@/@types/Winner'
import { Loading } from '@/app/components/Loading'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useRankedUsers } from '@/global/hooks/useRankedUsers'
import { useRanking } from '@/global/hooks/useRanking'
import { useApi } from '@/services/api'

const today = dayjs().day()
const sunday = 0
const restDays = today === sunday ? 7 : 7 - today

export function Ranking() {
  const { user, updateUser } = useAuthContext()
  const { ranking: currentRanking, rankings } = useRanking(
    user?.rankingId,
    true
  )
  const api = useApi()

  const { rankedUsers } = useRankedUsers(user?.rankingId ?? '')

  const [isLoading, setIsLoading] = useState(true)
  const [winners, setWinners] = useState<Winner[]>([])

  const badgesListRef = useRef<HTMLDivElement>(null)

  const lastRankingPosition = rankings?.length ?? 0
  const isAuthUserWinner = !!user?.lastPosition && user.lastPosition <= 5

  function getLastRankingPosition() {
    if (!currentRanking || !rankings || !user) return 0

    if (isAuthUserWinner && currentRanking.position !== lastRankingPosition) {
      return currentRanking.position - 1
    } else if (user.isLoser) {
      return currentRanking.position + 1
    } else {
      return currentRanking.position
    }
  }

  function sortWinners(winnersUsers: Winner[]) {
    return winnersUsers.sort((a: Winner, b: Winner) => {
      if (a.position === 2) {
        return -1
      }
      if (a.position === 1) {
        return b.position === 2 ? 1 : -1
      }
      if (a.position === 3) {
        return b.position === 2 || b.position === 1 ? 1 : -1
      }

      return 1
    })
  }

  async function showWinners() {
    if (!currentRanking || !rankings || !user) return

    try {
      const lastWeekRankingPosition = getLastRankingPosition()

      const lastWeekRanking = rankings.find(
        (ranking) => ranking.position === lastWeekRankingPosition
      )!

      const winnersUsers = await api.getWinnersByRankingId(lastWeekRanking.id)

      const sortedWinners = sortWinners(winnersUsers)

      setWinners(sortedWinners)

      await updateUser({ didUpdateRanking: false })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleHideWinners() {
    setWinners([])
  }

  useEffect(() => {
    if (user?.didUpdateRanking) {
      showWinners()
      return
    }

    if (!rankings?.length && badgesListRef.current && !isLoading) {
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [user, isLoading, rankings, currentRanking, badgesListRef])

  return (
    <div className="mt-6 w-screen max-w-5xl px-6 pb-6 md:mx-auto md:px-0">
      {isLoading && <Loading isSmall={false} />}

      {user && rankedUsers && rankings && currentRanking && (
        <>
          {winners.length > 0 && !isLoading ? (
            <WinnersList
              winners={winners}
              currentRanking={currentRanking}
              isAuthUserWinner={isAuthUserWinner}
              lastRankingPosition={lastRankingPosition}
              onHideWinners={handleHideWinners}
            />
          ) : (
            <>
              <BadgesList rankings={rankings} currentRanking={currentRanking} />

              <div className="mt-6 flex flex-col items-center justify-center gap-3">
                <p className="text-center font-medium text-gray-100">
                  Os 5 primeiros avançam para o próximo ranking.
                </p>

                <strong className="text-center text-green-400">
                  {restDays + (restDays === 1 ? ' dia' : ' dias')}
                </strong>
              </div>

              <RankedUsersList rankedUsers={rankedUsers} authUserId={user.id} />
            </>
          )}
        </>
      )}
    </div>
  )
}
