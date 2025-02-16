'use client'

import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useRouter() {
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

  return {
    goTo,
    goBack,
    refresh,
    currentRoute: pathname,
  }
}
