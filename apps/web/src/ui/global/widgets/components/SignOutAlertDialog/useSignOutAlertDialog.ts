'use client'

import { useState } from 'react'

import { useAuthContext } from '@/ui/global/contexts/AuthContext'

export function useSignOutAlertDialog() {
  const [isLoading, setIsLoading] = useState(false)

  const { handleSignOut } = useAuthContext()

  async function handleConfirm() {
    setIsLoading(true)

    await handleSignOut()

    setIsLoading(false)
  }

  return {
    isLoading,
    handleConfirm,
  }
}
