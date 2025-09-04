import type { AuthService } from '@stardust/core/auth/interfaces'
import { Text } from '@stardust/core/global/structures'
import { RestResponse } from '@stardust/core/global/responses'

import { CLIENT_ENV } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

const RETURN_URL = Text.create(`${CLIENT_ENV.webAppUrl}/profile/settings/social-accounts`)

type SocialAccountProvider = 'google' | 'github'

type Params = {
  authService: AuthService
  socialAccountProvider: SocialAccountProvider
}

export function useSocialAccountButton({ authService, socialAccountProvider }: Params) {
  const toast = useToastContext()

  async function handleSocialAccountDisconnect() {
    let response = new RestResponse()

    switch (socialAccountProvider) {
      case 'google':
        response = await authService.disconnectGoogleAccount()
        break
      case 'github':
        response = await authService.disconnectGithubAccount()
        break
    }

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
    }
  }

  async function handleSocialAccountConnect() {
    let response: RestResponse<{ signInUrl: string }> = new RestResponse()

    switch (socialAccountProvider) {
      case 'google':
        response = await authService.connectGoogleAccount(RETURN_URL)
        break
      case 'github':
        response = await authService.connectGithubAccount(RETURN_URL)
        break
    }

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
    }
    if (response.isSuccessful) {
      window.location.href = response.body.signInUrl
    }
  }

  return {
    handleSocialAccountConnect,
    handleSocialAccountDisconnect,
  }
}
