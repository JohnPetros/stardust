import { notFound } from 'next/navigation'

import { Id } from '@stardust/core/global/structures'

import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { AuthService, ProfileService } from '@/rest/services'
import { actionClient } from './actionClient'

export const authActionClient = actionClient.use(async ({ next }) => {
  const restClient = await NextServerRestClient({ isCacheEnabled: true })
  const authService = AuthService(restClient)
  const authResponse = await authService.fetchAccount()
  if (authResponse.isFailure) notFound()

  const accountId = Id.create(authResponse.body.id)
  const profileService = ProfileService(restClient)
  const profileResponse = await profileService.fetchUserById(accountId)
  if (profileResponse.isFailure) profileResponse.throwError()

  return next({ ctx: { user: profileResponse.body } })
})
