'use client'

import type { RefObject } from 'react'

import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'

type UseRankingWinnerUsersListProps = {
  rewardAlertDialog: RefObject<AlertDialogRef>
  successAlertDialog: RefObject<AlertDialogRef>
  failAlertDialog: RefObject<AlertDialogRef>
  onHideWinners: VoidFunction
}

export function useRankingWinnerUsersList({
  rewardAlertDialog,
  successAlertDialog,
  failAlertDialog,
  onHideWinners,
}: UseRankingWinnerUsersListProps) {
  const { user, updateUser } = useAuthContext()

  async function handleWinnerUserListButtonClick() {
    if (!user) return

    if (user.isTopRankingWinner && user.lastRankingPosition) {
      rewardAlertDialog.current?.open()
      user.earnLastRankingPositionReward()
      await updateUser(user)
      return
    }

    if (user.isRankingWinner) {
      successAlertDialog.current?.open()
      return
    }

    if (user?.isRankingLoser) {
      failAlertDialog.current?.open()
      user.resetRankingLoserState()
      await updateUser(user)
      return
    }

    onHideWinners()
  }

  async function handleAlertDialogButtonClick(type: 'reward' | 'success' | 'fail') {
    if (!user) return

    if (type === 'reward') {
      rewardAlertDialog.current?.close()

      user.hasNextRanking
        ? successAlertDialog.current?.open()
        : handleAlertDialogButtonClick('success')
      return
    }

    successAlertDialog.current?.close()
    failAlertDialog.current?.close()
    await updateUser(user)
    onHideWinners()
  }

  return {
    handleWinnerUserListButtonClick,
    handleAlertDialogButtonClick,
  }
}
