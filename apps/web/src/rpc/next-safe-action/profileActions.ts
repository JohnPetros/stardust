'use server'

import { z } from 'zod'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { AccessProfilePageAction } from '../actions/profile'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ProfileService } from '@/rest/services'
import { stringSchema } from '@stardust/validation/global/schemas'

const accessProfilePage = authActionClient
  .schema(
    z.object({
      userSlug: stringSchema,
    }),
  )
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = await NextServerRestClient()
    const profileService = ProfileService(restClient)
    const action = AccessProfilePageAction(profileService)
    return await action.handle(call)
  })

export { accessProfilePage }
