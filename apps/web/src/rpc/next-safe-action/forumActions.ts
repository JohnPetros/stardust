'use server'

import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { SupabaseServerActionClient } from '@/rest/supabase/clients/SupabaseServerActionClient'
import { SupabaseForumService } from '@/rest/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { UpvoteCommentAction } from '../actions/forum'

export const upvoteComment = authActionClient
  .schema(
    z.object({
      commentId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseForumService(supabase)
    const action = UpvoteCommentAction(challengingService)
    return await action.handle(call)
  })
