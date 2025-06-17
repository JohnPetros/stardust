'use server'

import { flattenValidationErrors } from 'next-safe-action'
import { z } from 'zod'

import {
  itemsPerPageSchema,
  pageSchema,
  idSchema,
  titleSchema,
  contentSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import {
  challengeDifficultyLevelSchema,
  challengeCompletionStatusSchema,
  challengeVoteSchema,
  challengeSchema,
} from '@stardust/validation/challenging/schemas'

import { SupabaseServerActionClient } from '@/rest/supabase/clients/SupabaseServerActionClient'
import { SupabaseChallengingService } from '@/rest/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import {
  EditSolutionAction,
  FetchChallengesListAction,
  AccessChallengePageAction,
  PostChallengeAction,
  PostSolutionAction,
  EditChallengeAction,
  UpvoteSolutionAction,
  ViewSolutionAction,
  VoteChallengeAction,
  AccessChallengeCommentsSlotAction,
  AccessChallengeEditorPageAction,
} from '../actions/challenging'
import { ChallengingService, SpaceService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'

export const fetchChallengesList = authActionClient
  .schema(
    z.object({
      page: pageSchema,
      itemsPerPage: itemsPerPageSchema,
      difficultyLevel: challengeDifficultyLevelSchema,
      completionStatus: challengeCompletionStatusSchema,
      title: stringSchema,
      categoriesIds: stringSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = FetchChallengesListAction(challengingService)
    return action.handle(call)
  })

export const accessChallengePage = authActionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const spaceService = SpaceService(restClient)
    const action = AccessChallengePageAction(challengingService, spaceService)
    return action.handle(call)
  })

export const accessChallengeEditorPage = authActionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = AccessChallengeEditorPageAction(challengingService)
    return action.handle(call)
  })

export const voteChallenge = authActionClient
  .schema(
    z.object({
      challengeId: idSchema,
      userChallengeVote: challengeVoteSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = VoteChallengeAction(challengingService)
    return action.handle(call)
  })

export const postSolution = authActionClient
  .schema(
    z.object({
      solutionTitle: titleSchema,
      solutionContent: contentSchema,
      authorId: idSchema,
      challengeId: idSchema,
    }),
    {
      handleValidationErrorsShape: async (errors) =>
        flattenValidationErrors(errors).fieldErrors,
    },
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = PostSolutionAction(challengingService)
    return action.handle(call)
  })

export const editSolution = authActionClient
  .schema(
    z.object({
      solutionTitle: titleSchema,
      solutionContent: contentSchema,
      solutionId: idSchema,
    }),
    {
      handleValidationErrorsShape: async (errors) =>
        flattenValidationErrors(errors).fieldErrors,
    },
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = EditSolutionAction(challengingService)
    return action.handle(call)
  })

export const upvoteSolution = authActionClient
  .schema(
    z.object({
      solutionId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = UpvoteSolutionAction(challengingService)
    return action.handle(call)
  })

export const accessChallengeCommentsSlot = authActionClient
  .schema(
    z.object({
      challengeSlug: z.string(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = AccessChallengeCommentsSlotAction(challengingService)
    return action.handle(call)
  })

export const viewSolution = authActionClient
  .schema(
    z.object({
      solutionSlug: z.string(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = ViewSolutionAction(challengingService)
    return action.handle(call)
  })

export const postChallenge = authActionClient
  .schema(challengeSchema, {
    handleValidationErrorsShape: async (errors) =>
      flattenValidationErrors(errors).fieldErrors,
  })
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = PostChallengeAction(challengingService)
    return action.handle(call)
  })

export const editChallenge = authActionClient
  .schema(z.object({ challengeId: idSchema, challenge: challengeSchema }), {
    handleValidationErrorsShape: async (errors) =>
      flattenValidationErrors(errors).fieldErrors,
  })
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = EditChallengeAction(challengingService)
    return action.handle(call)
  })
