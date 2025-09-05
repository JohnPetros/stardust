import { authActions } from "@/rpc/next-safe-action";
import { ActionResponse } from "@stardust/core/global/responses";
import { useAction } from "next-safe-action/hooks";
import { useCallback } from "react";

export function useSocialAccountActions(socialAccountProvider: 'google' | 'github') {
  const { executeAsync: disconnectSocialAccountAction } = useAction(
    authActions.disconnectSocialAccount,
  )
  const { executeAsync: connectSocialAccountAction } = useAction(
    authActions.connectSocialAccount,
  )

  const connectSocialAccount = useCallback(async (): Promise<
    ActionResponse
  > => {
    const response = await connectSocialAccountAction({
      socialAccountProvider: socialAccountProvider,
    })
    return response?.serverError
      ? new ActionResponse({ errorMessage: response.serverError })
      : new ActionResponse({ data: response?.data })
  }, [connectSocialAccountAction])

  const disconnectSocialAccount = useCallback(async (): Promise<
    ActionResponse
  > => {
    const response = await disconnectSocialAccountAction({
      socialAccountProvider: socialAccountProvider,
    })
    return response?.serverError
      ? new ActionResponse({ errorMessage: response.serverError })
      : new ActionResponse({ data: response?.data })
  }, [disconnectSocialAccountAction])

  return { disconnectSocialAccount, connectSocialAccount }
}
