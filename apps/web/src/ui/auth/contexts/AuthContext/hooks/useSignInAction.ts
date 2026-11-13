import { useAction } from 'next-safe-action/hooks'

import * as authActions from '@/rpc/next-safe-action/authActions'
import type { SignInActionResponse } from '@/rpc/actions/auth'
import { ActionResponse } from '@stardust/core/global/responses'

export function useSignInAction() {
  const { executeAsync } = useAction(authActions.signIn)

  async function signIn(
    email: string,
    password: string,
  ): Promise<ActionResponse<SignInActionResponse>> {
    const response = await executeAsync({ email, password })
    return response?.serverError
      ? new ActionResponse({ errorMessage: response.serverError })
      : new ActionResponse({ data: response?.data })
  }

  return { signIn }
}
