import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { AuthService } from '@/rest/services'
import { SocialAccountButton } from '../SocialAccountButton'
import { CACHE } from '@/constants/cache'

export const GoogleAccountButton = async () => {
  const restClient = await NextServerRestClient({
    cacheKey: CACHE.keys.googleAccountConnection,
  })
  const authService = AuthService(restClient)
  const response = await authService.fetchGoogleAccountConnection()
  const isConnected = response.isSuccessful ? response.body.isConnected : false

  return (
    <SocialAccountButton
      name='Google'
      logoUrl='google-logo.svg'
      provider='google'
      isConnected={isConnected}
    />
  )
}
