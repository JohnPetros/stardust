'use server'

import { z } from 'zod'

import {
  challengeDifficultyLevelSchema,
  idSchema,
  integerSchema,
} from '@stardust/validation/schemas'

import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { SupabaseServerActionClient } from '@/api/supabase/clients'
import {
  SupabaseChallengingService,
  SupabaseProfileService,
  SupabaseSpaceService,
} from '@/api/supabase/services'
import {
  RewardForChallengeCompletionAction,
  RewardForStarChallengeCompletionAction,
  RewardForStarCompletionAction,
} from '../actions/rewarding'

export const rewardForStarCompletion = authActionClient
  .schema(
    z.object({
      questionsCount: integerSchema,
      incorrectAnswersCount: integerSchema,
      secondsCount: integerSchema,
      starId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const profileService = SupabaseProfileService(supabase)
    const spaceService = SupabaseSpaceService(supabase)
    const action = RewardForStarCompletionAction(profileService, spaceService)
    return action.handle(actionServer)
  })

export const rewardForStarChallengeCompletion = authActionClient
  .schema(
    z.object({
      incorrectAnswersCount: integerSchema,
      secondsCount: integerSchema,
      starId: idSchema,
      challengeId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const profileService = SupabaseProfileService(supabase)
    const spaceService = SupabaseSpaceService(supabase)
    const challengingService = SupabaseChallengingService(supabase)
    const action = RewardForStarChallengeCompletionAction(
      profileService,
      spaceService,
      challengingService,
    )
    return action.handle(actionServer)
  })

export const rewardForChallengeCompletion = authActionClient
  .schema(
    z.object({
      incorrectAnswersCount: integerSchema,
      secondsCount: integerSchema,
      challengeId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const profileService = SupabaseProfileService(supabase)
    const challengingService = SupabaseChallengingService(supabase)
    const action = RewardForChallengeCompletionAction(profileService, challengingService)
    return action.handle(actionServer)
  })
