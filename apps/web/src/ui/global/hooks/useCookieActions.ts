'use client'

import { useAction } from 'next-safe-action/hooks'
import { useCallback } from 'react'

import { cookieActions } from '@/rpc/next-safe-action'
import { ActionResponse } from '@stardust/core/global/responses'

export function useCookieActions() {
  const { executeAsync: executeGetCookie } = useAction(cookieActions.getCookie)
  const { executeAsync: executeSetCookie } = useAction(cookieActions.setCookie)
  const { executeAsync: executeDeleteCookie } = useAction(cookieActions.deleteCookie)
  const { executeAsync: executeHasCookie } = useAction(cookieActions.hasCookie)

  const getCookie = useCallback(
    async (key: string) => {
      const result = await executeGetCookie(key)
      if (result?.serverError) {
        return new ActionResponse<string | null>({
          errorMessage: result.serverError,
        })
      }
      return new ActionResponse<string | null>({
        data: result?.data ?? null,
      })
    },
    [executeGetCookie],
  )

  const setCookie = useCallback(
    async (input: {
      value: string
      key: string
      durationInSeconds?: number | undefined
    }) => {
      const result = await executeSetCookie(input)
      return result?.serverError
        ? new ActionResponse({ errorMessage: result.serverError })
        : new ActionResponse()
    },
    [executeSetCookie],
  )

  const deleteCookie = useCallback(
    async (key: string) => {
      const result = await executeDeleteCookie(key)
      return result?.serverError
        ? new ActionResponse({ errorMessage: result.serverError })
        : new ActionResponse()
    },
    [executeDeleteCookie],
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
    setCookie,
    deleteCookie,
    hasCookie,
  }
}
