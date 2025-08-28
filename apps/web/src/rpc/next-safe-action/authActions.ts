'use server'

import { z } from 'zod'

import { emailSchema, passwordSchema } from '@stardust/validation/global/schemas'

import { CLIENT_ENV } from '@/constants'
import { AuthService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { NextRestClient } from '@/rest/next/NextRestClient'
import {
  SignInAction,
  SignOutAction,
  SignUpWithSocialAccountAction,
} from '../actions/auth'
import { actionClient } from './clients/actionClient'
import { NextCall } from '../next/NextCall'

export const signIn = actionClient
  .schema(
    z.object({
      email: emailSchema,
      password: passwordSchema,
    }),
  )
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = NextRestClient()
    restClient.setBaseUrl(CLIENT_ENV.serverAppUrl)
    const service = AuthService(restClient)
    const action = SignInAction(service)
    return await action.handle(call)
  })

export const signOut = actionClient.action(async () => {
  const call = NextCall()
  const restClient = await NextServerRestClient()
  const service = AuthService(restClient)
  const action = SignOutAction(service)
  return await action.handle(call)
})

export const signUpWithSocialAccount = actionClient
  .schema(
    z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
  )
  .action(async ({ clientInput }) => {
    const call = NextCall({ request: clientInput })
    const restClient = NextRestClient()
    restClient.setBaseUrl(CLIENT_ENV.serverAppUrl)
    restClient.setAuthorization(clientInput.accessToken)
    const service = AuthService(restClient)
    const action = SignUpWithSocialAccountAction(service)
    return await action.handle(call)
  })
