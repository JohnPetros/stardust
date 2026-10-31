import { useCallback } from 'react'
import { useRevalidator } from 'react-router'

import type { UiProvider } from '@stardust/core/ui/interfaces'

export function useUiProvider(): UiProvider {
  const revalidator = useRevalidator()

  const reload = useCallback(async () => {
    await revalidator.revalidate()
  }, [revalidator])

  return {
    reload,
  }
}
