'use server'

import { flattenValidationErrors } from 'next-safe-action'
import { z } from 'zod'

import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import {
  EditSolutionAction,
  FetchChallengesListAction,
  HandleChallengePageAction,
  PostSolutionAction,
  UpvoteSolutionAction,
  ViewSolutionAction,
  VoteChallengeAction,
} from '../actions/challenging'
import {
  itemsPerPageSchema,
  pageSchema,
  challengeDifficultyLevelSchema,
  challengeCompletionStatusSchema,
  challengeVoteSchema,
  idSchema,
  titleSchema,
  contentSchema,
} from '@stardust/validation/schemas'

export const fetchChallengesList = authActionClient
  .schema(
    z.object({
      page: pageSchema,
      itemsPerPage: itemsPerPageSchema,
      difficultyLevel: challengeDifficultyLevelSchema,
      completionStatus: challengeCompletionStatusSchema,
      title: z.string(),
      categoriesIds: z.string(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = FetchChallengesListAction(challengingService)
    return action.handle(actionServer)
  })

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
      challengeId: idSchema,
      userChallengeVote: challengeVoteSchema,
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
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = PostSolutionAction(challengingService)
    return action.handle(actionServer)
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
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = EditSolutionAction(challengingService)
    return action.handle(actionServer)
  })

export const upvoteSolution = authActionClient
  .schema(
    z.object({
      solutionId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = UpvoteSolutionAction(challengingService)
    return action.handle(actionServer)
  })

export const viewSolution = authActionClient
  .schema(
    z.object({
      solutionSlug: z.string(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = ViewSolutionAction(challengingService)
    return action.handle(actionServer)
  })
