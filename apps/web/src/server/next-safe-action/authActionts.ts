'use server'

import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'

import { InngestQueue } from '@/queue/inngest/InngestQueue'
import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import { SupabaseAuthService } from '@/api/supabase/services'
import { NextActionServer } from '../next/NextActionServer'
import { SignUpAction } from '../actions/auth'
import { actionClient } from './clients'

const signUp = actionClient
  .schema(z.object({ email: emailSchema, name: nameSchema, password: passwordSchema }))
  .action(async ({ clientInput }) => {
    const actionServer = NextActionServer({
      request: clientInput,
    })
    const supabase = SupabaseServerActionClient()
    const authService = SupabaseAuthService(supabase)
    const queue = InngestQueue()
    const action = SignUpAction(authService, queue)
    return await action.handle(actionServer)
  })

export { signUp }
