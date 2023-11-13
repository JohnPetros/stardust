'use client'

import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

import { BadgesList } from './components/BadgesList'
import { RankedUsersList } from './components/RankedUsersList'
import { WinnerUsersList } from './components/WinnerUsersList'

import type { Ranking } from '@/@types/ranking'
import type { WinnerUser } from '@/@types/user'
import { Loading } from '@/app/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import { useRankedUsers } from '@/hooks/useRankedUsers'
import { useRanking } from '@/hooks/useRanking'
import { useApi } from '@/services/api'

const today = dayjs().day()
const sunday = 0
const restDays = today === sunday ? 7 : 7 - today

export default function Ranking() {
  const { user, updateUser } = useAuth()
  const { ranking: currentRanking, rankings } = useRanking(
    user?.ranking_id,
    true
  )
  const api = useApi()

  const { rankedUsers } = useRankedUsers(user?.ranking_id ?? '')

  const [isLoading, setIsLoading] = useState(true)
  const [winnerUsers, setWinnerUsers] = useState<WinnerUser[]>([])

  const badgesListRef = useRef<HTMLDivElement>(null)

  const lastRankingPosition = rankings?.length ?? 0
  const isAuthUserWinner = !!user?.last_position && user.last_position <= 5

  function getLastRankingPosition() {
    if (!currentRanking || !rankings || !user) return 0

    if (isAuthUserWinner && currentRanking.position !== lastRankingPosition) {
      return currentRanking.position - 1
    } else if (user.is_loser) {
      return currentRanking.position + 1
    } else {
      return currentRanking.position
    }
  }

  function sortWinnerUsers(winnersUsers: WinnerUser[]) {
    return winnersUsers.sort((a: WinnerUser, b: WinnerUser) => {
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

      const winnersUsers = await api.getWinnerUsers(lastWeekRanking.id)

      const sortedWinnerUsers = sortWinnerUsers(winnersUsers)

      setWinnerUsers(sortedWinnerUsers)

      await updateUser({ did_update_ranking: false })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.did_update_ranking) {
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
          {winnerUsers.length > 0 && !isLoading ? (
            <WinnerUsersList
              winnerUsers={winnerUsers}
              currentRanking={currentRanking}
              setWinnerUsers={setWinnerUsers}
              isAuthUserWinner={isAuthUserWinner}
              lastRankingPosition={lastRankingPosition}
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
