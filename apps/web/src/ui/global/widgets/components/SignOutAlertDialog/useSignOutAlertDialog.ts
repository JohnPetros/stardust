import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useSignOutAlertDialog() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { handleSignOut } = useAuthContext()

  async function handleDialogConfirm() {
    setIsSigningOut(true)
    await handleSignOut()
    setIsSigningOut(false)
  }

  return {
    isSigningOut,
    handleDialogConfirm,
  }
}
