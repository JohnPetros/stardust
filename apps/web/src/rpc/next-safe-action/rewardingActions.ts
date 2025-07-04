'use server'

import { z } from 'zod'

import { idSchema, integerSchema } from '@stardust/validation/global/schemas'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import {
  AccessStarRewardingPageAction,
  AccessChallengeRewardingPageAction,
  AccessStarChallengeRewardingPageAction,
} from '../actions/rewarding'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ProfileService } from '@/rest/services'

export const accessRewardForStarCompletionPage = authActionClient
  .schema(
    z.object({
      questionsCount: integerSchema,
      incorrectAnswersCount: integerSchema,
      secondsCount: integerSchema,
      starId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const profileService = ProfileService(restClient)
    const action = AccessStarRewardingPageAction(profileService)
    return await action.handle(call)
  })

export const accessRewardForStarChallengeCompletionPage = authActionClient
  .schema(
    z.object({
      incorrectAnswersCount: integerSchema,
      maximumIncorrectAnswersCount: integerSchema,
      secondsCount: integerSchema,
      starId: idSchema,
      challengeId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const profileService = ProfileService(restClient)
    const action = AccessStarChallengeRewardingPageAction(profileService)
    return await action.handle(call)
  })

export const accessRewardForChallengeCompletionPage = authActionClient
  .schema(
    z.object({
      incorrectAnswersCount: integerSchema,
      maximumIncorrectAnswersCount: integerSchema,
      secondsCount: integerSchema,
      challengeId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const profileService = ProfileService(restClient)
    const action = AccessChallengeRewardingPageAction(profileService)
    return await action.handle(call)
  })
