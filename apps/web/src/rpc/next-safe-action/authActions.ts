'use server'

import { z } from 'zod'

import { emailSchema, passwordSchema } from '@stardust/validation/global/schemas'

import { AuthService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { NextCall } from '../next/NextCall'
import { actionClient } from './clients/actionClient'
import { SignInAction } from '../actions/auth'

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
    const restClient = await NextServerRestClient()
    const authService = AuthService(restClient)
    const action = SignInAction(authService)
    return await action.handle(call)
  })
