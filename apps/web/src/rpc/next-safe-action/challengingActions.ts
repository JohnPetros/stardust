'use server'

import { flattenValidationErrors } from 'next-safe-action'
import { z } from 'zod'

import { challengeSchema } from '@stardust/validation/challenging/schemas'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import {
  AccessChallengePageAction,
  PostChallengeAction,
  AccessChallengeCommentsSlotAction,
  AccessChallengeEditorPageAction,
  AccessSolutionPageAction,
} from '../actions/challenging'
import { ChallengingService, SpaceService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'

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
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = AccessChallengeEditorPageAction(challengingService)
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
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const challengingService = ChallengingService(restClient)
    const action = PostChallengeAction(challengingService)
    return action.handle(call)
  })
