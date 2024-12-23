import { useAction } from 'next-safe-action/hooks'
import { cookieActions } from '@/server/next-safe-action'

export function useCookieActions() {
  const { executeAsync: executeGetCookie } = useAction(cookieActions.getCookie)
  const { executeAsync: executeSetCookie } = useAction(cookieActions.setCookie)
  const { executeAsync: executeDeleteCookie } = useAction(cookieActions.deleteCookie)

  async function getCookie(key: string) {
    const result = await executeGetCookie(key)
    return result?.data ?? null
  }

  return {
    getCookie,
    setCookie: executeSetCookie,
    deleteCookie: executeDeleteCookie,
  }
}
