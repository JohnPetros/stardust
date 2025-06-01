import { CLIENT_ENV } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { AuthService, ProfileService } from '@/rest/services'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

const restClient = NextRestClient({ isCacheEnabled: false })
restClient.setBaseUrl(CLIENT_ENV.serverAppUrl)

export function useRest() {
  const { accessToken } = useAuthContext()

  if (accessToken) {
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
  }

  return {
    authService: AuthService(restClient),
    profileService: ProfileService(restClient),
  }
}
