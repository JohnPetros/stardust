import { useLocation, useNavigate } from 'react-router'
import { useCallback } from 'react'

import type { NavigationProvider } from '@stardust/core/global/interfaces'

export function useNavigationProvider(): NavigationProvider {
  const navigate = useNavigate()
  const location = useLocation()

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

  const openExternal = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return {
    goTo,
    goBack,
    refresh,
    openExternal,
    currentRoute: location.pathname,
  }
}
