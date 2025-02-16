'use client'

import { useState } from 'react'

export function useShopButton(onClick: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleShopButtonClick() {
    setIsLoading(true)

    try {
      await onClick()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleShopButtonClick,
  }
}
