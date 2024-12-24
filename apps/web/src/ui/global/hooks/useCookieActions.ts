import { useAction } from 'next-safe-action/hooks'
import { cookieActions } from '@/server/next-safe-action'
import { useCallback } from 'react'

export function useCookieActions() {
  const { executeAsync: executeGetCookie } = useAction(cookieActions.getCookie)
  const { executeAsync: executeSetCookie } = useAction(cookieActions.setCookie)
  const { executeAsync: executeDeleteCookie } = useAction(cookieActions.deleteCookie)

  const getCookie = useCallback(
    async (key: string) => {
      const result = await executeGetCookie(key)
      return result?.data ?? null
    },
    [executeGetCookie],
  )

  return {
    getCookie,
    setCookie: executeSetCookie,
    deleteCookie: executeDeleteCookie,
  }
}
