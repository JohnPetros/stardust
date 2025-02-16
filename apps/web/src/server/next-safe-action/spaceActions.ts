'use server'

import { z } from 'zod'

import { SupabaseServerActionClient } from '@/api/supabase/clients'
import { SupabaseSpaceService } from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { AccessStarPageAction } from '../actions/space'

export const accessStarPage = authActionClient
  .schema(
    z.object({
      starSlug: z.string(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const service = SupabaseSpaceService(supabase)
    const action = AccessStarPageAction(service)
    return await action.handle(actionServer)
  })
