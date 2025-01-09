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

  return {
    goTo,
    goBack,
    currentRoute: pathname,
  }
}
