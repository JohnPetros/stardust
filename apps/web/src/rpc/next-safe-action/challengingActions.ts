'use server'

import { z } from 'zod'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'

import { ChallengingService, SpaceService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import {
  AccessChallengePageAction,
  AccessChallengeCommentsSlotAction,
  AccessChallengeEditorPageAction,
  AccessSolutionPageAction,
  ViewSolutionAction,
} from '../actions/challenging'
import { actionClient } from './clients'

export const accessAuthenticatedChallengePage = authActionClient
  .schema(z.object({ challengeSlug: z.string() }))
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
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
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
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
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = AccessChallengeEditorPageAction(challengingService)
    return action.handle(call)
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
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
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
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
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
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = ViewSolutionAction(challengingService)
    return action.handle(call)
  })
