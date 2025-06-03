'use client'

import { useAction } from 'next-safe-action/hooks'
import { useCallback } from 'react'

import { cookieActions } from '@/rpc/next-safe-action'

export function useCookieActions() {
  const { executeAsync: executeGetCookie } = useAction(cookieActions.getCookie)
  const { executeAsync: executeSetCookie } = useAction(cookieActions.setCookie)
  const { executeAsync: executeDeleteCookie } = useAction(cookieActions.deleteCookie)
  const { executeAsync: executeHasCookie } = useAction(cookieActions.hasCookie)

  const getCookie = useCallback(
    async (key: string) => {
      const result = await executeGetCookie(key)
      return result?.data ?? null
    },
    [executeGetCookie],
  )

  const hasCookie = useCallback(
    async (key: string) => {
      const result = await executeHasCookie(key)
      return typeof result?.data !== 'undefined' ? result.data : false
    },
    [executeHasCookie],
  )

  return {
    getCookie,
    setCookie: executeSetCookie,
    deleteCookie: executeDeleteCookie,
    hasCookie,
  }
}
