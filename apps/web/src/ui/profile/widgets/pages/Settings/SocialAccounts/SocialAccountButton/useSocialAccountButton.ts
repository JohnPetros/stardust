import type { ActionResponse } from '@stardust/core/global/responses'

import { useToastContext } from '@/ui/global/contexts/ToastContext'

type Params = {
  onConnectSocialAccount: () => Promise<ActionResponse>
  onDisconnectSocialAccount: () => Promise<ActionResponse>
}

export function useSocialAccountButton({
  onConnectSocialAccount,
  onDisconnectSocialAccount,
}: Params) {
  const toast = useToastContext()

  async function handleSocialAccountDisconnect() {
    const response = await onDisconnectSocialAccount()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
    }
  }

  async function handleSocialAccountConnect() {
    const response = await onConnectSocialAccount()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
    }
  }

  return {
    handleSocialAccountConnect,
    handleSocialAccountDisconnect,
  }
}
