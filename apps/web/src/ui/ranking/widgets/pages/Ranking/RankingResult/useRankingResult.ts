import { type RefObject, useEffect, useState } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { _getLastWeekRankingWinners } from './_getLastWeekRankingWinners'
import { playAudio } from '@/utils'
import { Podium } from '@stardust/core/ranking/structs'
import { Tier } from '@stardust/core/ranking/entities'

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
  const [lastWeekRankingPodium, setLastWeekRankingPodium] = useState<Podium | null>(null)
  const [lastWeekTier, setLastWeekTier] = useState<Tier | null>(null)
  const [isUserLoser, setIsUserLoser] = useState<boolean>(false)
  const [isLoading, setIsloading] = useState<boolean>(true)
  const toast = useToastContext()
  const { user, updateUser } = useAuthContext()

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

  async function handleAlertDialogButtonClick(type: 'reward' | 'success' | 'fail') {
    if (!user) return

    if (type === 'reward') {
      rewardAlertDialog.current?.close()

      user.earnLastWeekRankingPositionReward()
      user.seeRankingResult()

      user.tier.hasNextTier
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
      if (!user || !isLoading) return

      try {
        const { isUserLoser, lastWeekTier, lastWeekRankingWinners } =
          await _getLastWeekRankingWinners(user.dto)

        setLastWeekRankingPodium(Podium.create(lastWeekRankingWinners))
        setLastWeekTier(Tier.create(lastWeekTier))
        setIsUserLoser(isUserLoser)
        playAudio('earning.wav')
      } catch (error) {
        // toast.show(error.message)
      } finally {
        setIsloading(false)
      }
    }

    setRankingResult()
  }, [user, isLoading])

  return {
    lastWeekRankingPodium,
    lastWeekTier,
    isUserLoser,
    isLoading,
    handleWRankingResultButtonClick,
    handleAlertDialogButtonClick,
  }
}
