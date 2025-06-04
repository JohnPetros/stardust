import { useAction } from 'next-safe-action/hooks'

import { authActions } from '@/rpc/next-safe-action'
import { ActionResponse } from '@stardust/core/global/responses'

export function useSignOutAction() {
  const { executeAsync } = useAction(authActions.signOut)

  async function signOut(): Promise<ActionResponse<void>> {
    const response = await executeAsync()
    return response?.serverError
      ? new ActionResponse({ errorMessage: response.serverError })
      : new ActionResponse()
  }

  return { signOut }
}
