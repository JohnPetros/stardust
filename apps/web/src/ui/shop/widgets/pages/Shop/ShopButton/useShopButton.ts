import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useShopButton(onItemAcquire: () => Promise<boolean>) {
  const [isLoading, setIsLoading] = useState(false)
  const { refetchUser } = useAuthContext()
  const [hasAcquiredItem, setHasAcquiredItem] = useState(false)

  async function handleShopButtonClick() {
    setIsLoading(true)
    const hasAcquiredItem = await onItemAcquire()
    setHasAcquiredItem(hasAcquiredItem)
    setIsLoading(false)
  }

  function handleAlertOpenChange(isOpen: boolean) {
    if (!isOpen && hasAcquiredItem) {
      refetchUser()
    }
    setHasAcquiredItem(false)
  }

  return {
    isLoading,
    handleShopButtonClick,
    handleAlertOpenChange,
  }
}
