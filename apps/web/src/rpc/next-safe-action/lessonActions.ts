'use server'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import {
  AccessEndingPageAction,
  FetchLessonStoryAndQuestionsAction,
} from '../actions/lesson'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseLessonService } from '@/rest/supabase/services'
import { idSchema } from '@stardust/validation/global/schemas'
import { z } from 'zod'

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
    const supabase = await SupabaseServerClient()
    const service = SupabaseLessonService(supabase)
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
