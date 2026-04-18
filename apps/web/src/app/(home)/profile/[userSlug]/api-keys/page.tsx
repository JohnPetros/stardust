import { notFound } from 'next/navigation'

import { Id } from '@stardust/core/global/structures'
import { User } from '@stardust/core/profile/entities'

import type { NextParams } from '@/rpc/next/types'
import { AuthService, ProfileService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ApiKeysPage } from '@/ui/profile/widgets/pages/ApiKeys'

const Page = async ({ params }: NextParams<'userSlug'>) => {
  const { userSlug } = await params
  const restClient = await NextServerRestClient({
    isCacheEnabled: true,
    refetchInterval: 60,
    cacheKey: `profile-api-keys:${userSlug}`,
  })
  const authService = AuthService(restClient)
  const authResponse = await authService.fetchAccount()

  if (authResponse.isFailure) {
    notFound()
  }

  const profileService = ProfileService(restClient)
  const userResponse = await profileService.fetchUserById(Id.create(authResponse.body.id))

  if (userResponse.isFailure) {
    notFound()
  }

  const user = User.create(userResponse.body)

  if (user.slug.value !== userSlug || user.hasEngineerRole.isFalse) {
    notFound()
  }

  return <ApiKeysPage />
}

export default Page
