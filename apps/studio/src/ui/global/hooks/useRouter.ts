import { useNavigate } from 'react-router'
import { useCallback } from 'react'

export function useRouter() {
  const navigate = useNavigate()

  const goTo = useCallback(
    (route: string) => {
      navigate(route)
    },
    [navigate],
  )

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const refresh = useCallback(() => {
    window.location.reload()
  }, [])

  return {
    goTo,
    goBack,
    refresh,
  }
}
