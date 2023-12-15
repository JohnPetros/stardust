'use client'

import { useState } from 'react'

export function useShopButton(shopHandler: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleShopButton() {
    setIsLoading(true)

    try {
      await shopHandler()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleShopButton,
  }
}
