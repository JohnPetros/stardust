'use server'

import { z } from 'zod'

import { emailSchema, nameSchema, passwordSchema } from '@stardust/validation/schemas'

import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import {
  SupabaseAuthService,
  SupabaseProfileService,
  SupabaseRankingService,
  SupabaseShopService,
  SupabaseSpaceService,
} from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { SignUpAction } from '../actions/auth'

const signUp = authActionClient
  .schema(z.object({ email: emailSchema, name: nameSchema, password: passwordSchema }))
  .action(async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const authService = SupabaseAuthService(supabase)
    const profileService = SupabaseProfileService(supabase)
    const rankingService = SupabaseRankingService(supabase)
    const shopService = SupabaseShopService(supabase)
    const spaceService = SupabaseSpaceService(supabase)

    const action = SignUpAction({
      authService,
      profileService,
      rankingService,
      shopService,
      spaceService,
    })
    return action.handle(actionServer)
  })

export { signUp }
