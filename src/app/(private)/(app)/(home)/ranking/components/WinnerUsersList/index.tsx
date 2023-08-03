import { WinnerUser } from './WinnerUser'

import type { Ranking } from '@/types/ranking'
import type { WinnerUser as WinnerUserType } from '@/types/user'

interface WinnerUsersListProps {
  winnerUsers: WinnerUserType[]
  setWinnerUsers: (winnerUsers: WinnerUserType[]) => void
  isAuthUserWinner: boolean
  currentRanking: Ranking
  lastRankingPosition: number
}

export function WinnerUsersList({
  winnerUsers,
  setWinnerUsers,
  isAuthUserWinner,
  lastRankingPosition,
}: WinnerUsersListProps) {
  console.log(winnerUsers.length)

  return (
    <div>
      <h3 className="text-center text-lg text-gray-100 font-semibold">
        Resultado da semana
      </h3>
      <div className="flex gap-6 justify-center items-end mt-8">
        {winnerUsers.map((winnerUser) => (
          <WinnerUser key={winnerUser.id} data={winnerUser} />
        ))}
      </div>
    </div>
  )
}
