import { type RefObject, useEffect, useState } from 'react'

import { Podium } from '@stardust/core/ranking/structures'
import { Tier } from '@stardust/core/ranking/entities'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'
import { useGetLastWeekRankingWinnersAction } from './useGetLastWeekRankingWinnersAction'
import { useRankingContext } from '@/ui/ranking/contexts/RankingContext'

type UseRankingResultProps = {
  rewardAlertDialog: RefObject<AlertDialogRef>
  successAlertDialog: RefObject<AlertDialogRef>
  failAlertDialog: RefObject<AlertDialogRef>
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
  const { user, updateUser } = useAuthContext()
  const { playAudio } = useAudioContext()
  const { userTier } = useRankingContext()
  const { getLastWeekRankingWinners } = useGetLastWeekRankingWinnersAction()

  async function handleWRankingResultButtonClick() {
    if (!user || !lastWeekTier || !userTier) return

    if (user.isTopRankingWinner) {
      rewardAlertDialog.current?.open()
      return
    }

    const userLastWeekVeteran =
      userTier.isLastTier.isTrue && lastWeekTier.isLastTier.isTrue

    if (user.isRankingWinner.isTrue && !userLastWeekVeteran) {
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

      userTier?.hasNextTier.isTrue
        ? successAlertDialog.current?.open()
        : handleAlertDialogButtonClick('success')
      return
    }

    successAlertDialog.current?.close()
    failAlertDialog.current?.close()
    user.seeRankingResult()
    await updateUser(user)
  }

  useEffect(() => {
    async function setRankingResult() {
      if (!user || !isLoading) return

      const { isUserLoser, lastWeekTier, lastWeekRankingWinners } =
        await getLastWeekRankingWinners()

      setLastWeekRankingPodium(Podium.create(lastWeekRankingWinners))
      setLastWeekTier(Tier.create(lastWeekTier))
      setIsUserLoser(isUserLoser)
      playAudio('earning.wav')
      setIsloading(false)
    }

    setRankingResult()
  }, [user, isLoading, getLastWeekRankingWinners, playAudio])

  return {
    lastWeekRankingPodium,
    lastWeekTier,
    isUserLoser,
    isLoading,
    handleWRankingResultButtonClick,
    handleAlertDialogButtonClick,
  }
}
