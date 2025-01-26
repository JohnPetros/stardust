import { type RefObject, useEffect } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

export function useStreakBreakDialog(alertDialogRef: RefObject<AlertDialogRef>) {
  const { user, updateUser } = useAuthContext()

  async function handleAlertDialogOpenChange(isOpen: boolean) {
    if (!isOpen && user) {
      user.resetStreak()
      await updateUser(user)
    }
  }

  useEffect(() => {
    if (user?.didBreakStreak.isTrue) alertDialogRef.current?.open()
  }, [user?.didBreakStreak.isTrue, alertDialogRef.current?.open])

  return {
    handleAlertDialogOpenChange,
  }
}
