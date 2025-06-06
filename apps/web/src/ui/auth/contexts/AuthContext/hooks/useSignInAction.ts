import { useAction } from 'next-safe-action/hooks'

import { authActions } from '@/rpc/next-safe-action'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { ActionResponse } from '@stardust/core/global/responses'

export function useSignInAction() {
  const { executeAsync } = useAction(authActions.signIn)

  async function signIn(
    email: string,
    password: string,
  ): Promise<ActionResponse<AccountDto>> {
    const response = await executeAsync({ email, password })
    return response?.serverError
      ? new ActionResponse({ errorMessage: response.serverError })
      : new ActionResponse({ data: response?.data })
  }

  return { signIn }
}
