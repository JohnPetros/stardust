import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { AuthService } from '@/rest/services'
import { SocialAccountButton } from '../SocialAccountButton'
import { CACHE } from '@/constants'

export const GithubAccountButton = async () => {
  const restClient = await NextServerRestClient({
    cacheKey: CACHE.keys.githubAccountConnection,
  })
  const authService = AuthService(restClient)
  const response = await authService.fetchGithubAccountConnection()
  const isConnected = response.isSuccessful ? response.body.isConnected : false

  return (
    <SocialAccountButton
      name='GitHub'
      logoUrl='github-logo.svg'
      provider='github'
      isConnected={isConnected}
    />
  )
}
