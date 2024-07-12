import { useRouter as useNextRouter, usePathname } from 'next/navigation'

export function useRouter() {
  const router = useNextRouter()
  const pathname = usePathname()

  function goTo(route: string) {
    router.push(route)
  }

  function getCurrentroute() {
    return pathname
  }

  return {
    goTo,
    getCurrentroute,
  }
}
