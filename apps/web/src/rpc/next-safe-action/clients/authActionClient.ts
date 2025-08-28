import { notFound } from 'next/navigation'

import { Account } from '@stardust/core/auth/entities'

import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { AuthService } from '@/rest/services/AuthService'
import { ProfileService } from '@/rest/services/ProfileService'
import { actionClient } from './actionClient'

export const authActionClient = actionClient.use(async ({ next }) => {
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const authResponse = await authService.fetchAccount()
  if (authResponse.isFailure) notFound()

  const account = Account.create(authResponse.body)

  const profileService = ProfileService(restClient)
  const profileResponse = await profileService.fetchUserById(account.id, account.provider)
  if (profileResponse.isFailure) profileResponse.throwError()

  return next({ ctx: { user: profileResponse.body } })
})
