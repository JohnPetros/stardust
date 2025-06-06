'use server'

import { z } from 'zod'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { AccessStarPageAction } from '../actions/space'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'

export const accessStarPage = authActionClient
  .schema(
    z.object({
      starSlug: z.string(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: true })
    const service = SpaceService(restClient)
    const action = AccessStarPageAction(service)
    return await action.handle(call)
  })
