'use server'

import { z } from 'zod'

import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import { SupabaseForumService } from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { UpvoteCommentAction } from '../actions/forum'

export const upvoteComment = authActionClient
  .schema(
    z.object({
      commentId: z.string().uuid(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseForumService(supabase)
    const action = UpvoteCommentAction(challengingService)
    return action.handle(actionServer)
  })

const  = await upvoteComment({ commentId: '' })
data?.data?.upvotesCount
