'use server'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import {
  AccessEndingPageAction,
  FetchLessonStoryAndQuestionsAction,
} from '../actions/lesson'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseLessonService } from '@/rest/supabase/services'
import { z } from 'zod'
import { idSchema } from '@stardust/validation/global/schemas'

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
    const supabase = SupabaseServerClient()
    const service = SupabaseLessonService(supabase)
    const action = FetchLessonStoryAndQuestionsAction(service)
    return await action.handle(call)
  })

const accessEndingPage = authActionClient.action(async ({ clientInput, ctx }) => {
  const call = NextCall({
    request: clientInput,
    user: ctx.user,
  })
  const action = AccessEndingPageAction()
  return await action.handle(call)
})

export { accessEndingPage }
