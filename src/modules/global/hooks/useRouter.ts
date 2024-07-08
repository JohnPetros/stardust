import { useRouter as useNextRouter } from 'next/navigation'

export function useRouter() {
  const router = useNextRouter()

  function goTo(route: string) {
    router.push(route)
  }

  return {
    goTo,
  }
}
