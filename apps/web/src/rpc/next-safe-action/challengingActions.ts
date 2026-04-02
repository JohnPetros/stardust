'use server'

import { z } from 'zod'
import { challengeVoteSchema } from '@stardust/validation/challenging/schemas'
import { idSchema } from '@stardust/validation/global/schemas'

import { actionClient } from './clients/actionClient'
import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'

import { ChallengingService, SpaceService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import {
  AccessChallengePageAction,
  AccessChallengeCommentsSlotAction,
  AccessChallengeEditorPageAction,
  AccessSolutionPageAction,
  UpdateChallengeVisibilityAction,
  ViewSolutionAction,
  VoteChallengeAction,
} from '../actions/challenging'

const CHALLENGING_ACTIONS_CACHE_KEY = 'challenging-actions'

export const accessAuthenticatedChallengePage = authActionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({
      isCacheEnabled: true,
      refetchInterval: 60,
      cacheKey: CHALLENGING_ACTIONS_CACHE_KEY,
    })
    const challengingService = ChallengingService(restClient)
    const spaceService = SpaceService(restClient)
    const action = AccessChallengePageAction({
      isAuthenticated: true,
      challengingService,
      spaceService,
    })
    return action.handle(call)
  })

export const accessChallengePage = actionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = await NextServerRestClient({
      isCacheEnabled: true,
      refetchInterval: 60,
      cacheKey: CHALLENGING_ACTIONS_CACHE_KEY,
    })
    const challengingService = ChallengingService(restClient)
    const spaceService = SpaceService(restClient)
    const action = AccessChallengePageAction({
      isAuthenticated: false,
      challengingService,
      spaceService,
    })
    return action.handle(call)
  })

export const accessChallengeEditorPage = authActionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({
      isCacheEnabled: true,
      refetchInterval: 60,
      cacheKey: CHALLENGING_ACTIONS_CACHE_KEY,
    })
    const challengingService = ChallengingService(restClient)
    const action = AccessChallengeEditorPageAction(challengingService)
    return await action.handle(call)
  })

export const accessChallengeCommentsSlot = actionClient
  .schema(
    z.object({
      challengeSlug: z.string(),
    }),
  )
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = await NextServerRestClient({
      isCacheEnabled: true,
      refetchInterval: 60,
      cacheKey: CHALLENGING_ACTIONS_CACHE_KEY,
    })
    const challengingService = ChallengingService(restClient)
    const action = AccessChallengeCommentsSlotAction(challengingService)
    return action.handle(call)
  })

export const accessSolutionPage = authActionClient
  .schema(
    z.object({
      challengeSlug: z.string(),
      solutionSlug: z.string().optional(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({
      isCacheEnabled: true,
      refetchInterval: 60,
      cacheKey: CHALLENGING_ACTIONS_CACHE_KEY,
    })
    const challengingService = ChallengingService(restClient)
    const action = AccessSolutionPageAction(challengingService)
    return action.handle(call)
  })

export const viewSolution = authActionClient
  .schema(z.object({ solutionSlug: z.string() }))
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = await NextServerRestClient({
      isCacheEnabled: true,
      refetchInterval: 60,
      cacheKey: CHALLENGING_ACTIONS_CACHE_KEY,
    })
    const challengingService = ChallengingService(restClient)
    const action = ViewSolutionAction(challengingService)
    return action.handle(call)
  })

export const voteChallenge = authActionClient
  .schema(
    z.object({
      challengeId: idSchema,
      challengeVote: challengeVoteSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = VoteChallengeAction(challengingService)
    return action.handle(call)
  })

export const updateChallengeVisibility = authActionClient
  .schema(
    z.object({
      challengeId: idSchema,
      isPublic: z.boolean(),
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = UpdateChallengeVisibilityAction(challengingService)
    return action.handle(call)
  })
