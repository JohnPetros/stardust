import { type RefObject, useEffect, useState } from 'react'

import { _getCookie } from '@/modules/global/actions'
import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useRankingContext } from '@/modules/app/contexts/RankingContext'
import type { RankingUserDTO, TierDTO } from '@/@core/dtos'
import { _getLastWeekRankingWinners } from './_getLastWeekRankingWinners'

type UseRankingResultProps = {
  rewardAlertDialog: RefObject<AlertDialogRef>
  successAlertDialog: RefObject<AlertDialogRef>
  failAlertDialog: RefObject<AlertDialogRef>
  _getLastWeekRankingWinners: typeof _getLastWeekRankingWinners
}

export function useRankingResult({
  rewardAlertDialog,
  successAlertDialog,
  failAlertDialog,
}: UseRankingResultProps) {
  const [lastWeekRankingWinners, setLastWeekRankingWinners] = useState<RankingUserDTO[]>(
    []
  )
  const [lastWeekTier, setLastWeekTier] = useState<TierDTO | null>(null)
  const [isUserLoser, setIsUserLoser] = useState<boolean>(false)
  const { user, updateUser } = useAuthContext()
  const { tiers } = useRankingContext()

  async function handleWRankingResultButtonClick() {
    if (!user) return

    if (user.isTopRankingWinner) {
      rewardAlertDialog.current?.open()
      return
    }

    if (user.isRankingWinner) {
      successAlertDialog.current?.open()
      return
    }

    if (isUserLoser) {
      failAlertDialog.current?.open()
      return
    }

    user.seeRankingResult()
    await updateUser(user)
  }

  function checkNextTier(currentTierPosition: number) {
    return tiers.find((tier) => tier.position === currentTierPosition)
  }

  async function handleAlertDialogButtonClick(type: 'reward' | 'success' | 'fail') {
    if (!user) return

    if (type === 'reward') {
      rewardAlertDialog.current?.close()

      user.earnLastWeekRankingPositionReward()
      user.seeRankingResult()

      const hasNextRanking = checkNextTier(user.tier.position.value)

      hasNextRanking
        ? successAlertDialog.current?.open()
        : handleAlertDialogButtonClick('success')
      return
    }

    successAlertDialog.current?.close()
    failAlertDialog.current?.close()
    await updateUser(user)
  }

  useEffect(() => {
    async function setRankingResult() {
      if (!user) return

      const { isUserLoser, lastWeekTier, lastWeekRankingWinners } =
        await _getLastWeekRankingWinners(user.dto)

      setLastWeekRankingWinners(lastWeekRankingWinners)
      setLastWeekTier(lastWeekTier)
      setIsUserLoser(isUserLoser)
    }

    setRankingResult()
  }, [user])

  return {
    lastWeekRankingWinners,
    lastWeekTier,
    isUserLoser,
    handleWRankingResultButtonClick,
    handleAlertDialogButtonClick,
  }
}
