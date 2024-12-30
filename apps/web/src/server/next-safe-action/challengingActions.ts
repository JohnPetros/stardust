'use server'

import { z } from 'zod'

import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { HandleChallengePageAction, VoteChallengeAction } from '../actions/challenging'

export const handleChallengePage = authActionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = HandleChallengePageAction(challengingService)
    return action.handle(actionServer)
  })

export const voteChallenge = authActionClient
  .schema(
    z.object({
      challengeId: z.string().uuid(),
      userChallengeVote: z.enum(['downvote', 'upvote']),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = VoteChallengeAction(challengingService)
    return action.handle(actionServer)
  })
