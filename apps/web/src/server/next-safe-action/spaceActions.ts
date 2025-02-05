'use server'

import { z } from 'zod'

import { SupabaseServerClient } from '@/api/supabase/clients'
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
    const supabase = SupabaseServerClient()
    const spaceService = SupabaseSpaceService(supabase)
    const action = AccessStarPageAction(spaceService)
    return action.handle(actionServer)
  })
