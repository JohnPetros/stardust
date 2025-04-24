'use server'

import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'

import { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import { SupabaseServerActionClient } from '@/rest/supabase/clients/SupabaseServerActionClient'
import { SupabaseAuthService } from '@/rest/supabase/services'
import { NextCall } from '../next/NextCall'
import { SignUpAction } from '../actions/auth'
import { actionClient } from './clients'

const signUp = actionClient
  .schema(z.object({ email: emailSchema, name: nameSchema, password: passwordSchema }))
  .action(async ({ clientInput }) => {
    const call = NextCall({
      request: clientInput,
    })
    const supabase = SupabaseServerActionClient()
    const authService = SupabaseAuthService(supabase)
    const queue = InngestAmqp()
    const action = SignUpAction(authService, queue)
    return await action.handle(call)
  })

export { signUp }
