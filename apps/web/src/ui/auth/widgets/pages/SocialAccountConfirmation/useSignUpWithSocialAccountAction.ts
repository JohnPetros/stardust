import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import { ActionResponse } from '@stardust/core/global/responses'

import { authActions } from '@/rpc/next-safe-action'

export function useSignUpWithSocialAccountAction() {
  const { executeAsync } = useAction(authActions.signUpWithSocialAccount)

  const signUpWithSocialAccount = useCallback(
    async (
      accessToken: string,
      refreshToken: string,
    ): Promise<ActionResponse<{ isNewAccount: boolean }>> => {
      const response = await executeAsync({ accessToken, refreshToken })
      return response?.serverError
        ? new ActionResponse({ errorMessage: response.serverError })
        : new ActionResponse({ data: response?.data })
    },
    [executeAsync],
  )

  return { signUpWithSocialAccount }
}
