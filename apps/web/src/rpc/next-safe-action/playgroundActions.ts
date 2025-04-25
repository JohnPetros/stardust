'use server'

import { z } from 'zod'

import {
  titleSchema,
  stringSchema,
  idSchema,
  booleanSchema,
} from '@stardust/validation/global/schemas'

import { SupabaseServerActionClient } from '@/rest/supabase/clients/SupabaseServerActionClient'
import { SupabasePlaygroundService } from '@/rest/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { CreateSnippetAction, EditSnippetAction } from '../actions/playground'
import { flattenValidationErrors } from 'next-safe-action'

export const editSnippet = authActionClient
  .schema(
    z.object({
      snippetId: idSchema,
      snippetTitle: titleSchema.optional(),
      snippetCode: stringSchema.optional(),
      isSnippetPublic: booleanSchema.optional(),
    }),
    {
      handleValidationErrorsShape: async (errors) =>
        flattenValidationErrors(errors).fieldErrors,
    },
  )
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const supabase = SupabaseServerActionClient()
    const playgroundService = SupabasePlaygroundService(supabase)
    const action = EditSnippetAction(playgroundService)
    return action.handle(call)
  })

export const createSnippet = authActionClient
  .schema(
    z.object({
      snippetTitle: titleSchema,
      snippetCode: stringSchema,
      isSnippetPublic: booleanSchema,
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
    const playgroundService = SupabasePlaygroundService(supabase)
    const action = CreateSnippetAction(playgroundService)
    return action.handle(call)
  })
