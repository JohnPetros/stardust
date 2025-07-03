'use server'

import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { PlaygroundService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { NextCall } from '../next/NextCall'
import { authActionClient } from './clients/authActionClient'
import { AccessSnippetPageAction } from '../actions/playground'

export const accessSnippetPage = authActionClient
  .schema(
    z.object({
      snippetId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const playgroundService = PlaygroundService(restClient)
    const action = AccessSnippetPageAction(playgroundService)
    return action.handle(call)
  })
