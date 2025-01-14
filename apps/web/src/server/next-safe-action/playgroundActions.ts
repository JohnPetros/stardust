'use server'

import { z } from 'zod'

import {
  titleSchema,
  stringSchema,
  idSchema,
  booleanSchema,
} from '@stardust/validation/global/schemas'

import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import { SupabasePlaygroundService } from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { CreateSnippetAction, EditSnippetAction } from '../actions/playground'

export const editSnippet = authActionClient
  .schema(
    z.object({
      snippetId: idSchema,
      snippetTitle: titleSchema.optional(),
      snippetCode: stringSchema.optional(),
    }),
  )
  .action(async ({ clientInput }) => {
    const actionServer = NextActionServer({
      request: clientInput,
    })
    const supabase = SupabaseServerActionClient()
    const playgroundService = SupabasePlaygroundService(supabase)
    const action = EditSnippetAction(playgroundService)
    return action.handle(actionServer)
  })

export const createSnippet = authActionClient
  .schema(
    z.object({
      snippetTitle: titleSchema,
      snippetCode: stringSchema,
      isSnippetPublic: booleanSchema,
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const playgroundService = SupabasePlaygroundService(supabase)
    const action = CreateSnippetAction(playgroundService)
    return action.handle(actionServer)
  })
