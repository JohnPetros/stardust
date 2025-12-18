import { useCallback } from 'react'
import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import type { NavigationProvider } from '@stardust/core/global/interfaces'

export function useNavigationProvider(): NavigationProvider {
  const router = useNextRouter()
  const pathname = usePathname()

  const goTo = useCallback(
    (route: string) => {
      router.push(route)
    },
    [router.push],
  )

  const goBack = useCallback(() => {
    router.back()
  }, [router.back])

  const refresh = useCallback(() => {
    window.location.reload()
  }, [])

  const openExternal = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return {
    goTo,
    goBack,
    refresh,
    openExternal,
    currentRoute: pathname,
  }
}
