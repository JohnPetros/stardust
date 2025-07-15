'use server'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import {
  AccessEndingPageAction,
  FetchLessonStoryAndQuestionsAction,
} from '../actions/lesson'
import { idSchema } from '@stardust/validation/global/schemas'
import { z } from 'zod'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { LessonService } from '@/rest/services/LessonService'

export const fetchLessonStoryAndQuestions = authActionClient
  .schema(
    z.object({
      starId: idSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient()
    const service = LessonService(restClient)
    const action = FetchLessonStoryAndQuestionsAction(service)
    return await action.handle(call)
  })

const accessEndingPage = authActionClient.action(async ({ ctx }) => {
  const call = NextCall({
    user: ctx.user,
  })
  const action = AccessEndingPageAction()
  return await action.handle(call)
})

export { accessEndingPage }
