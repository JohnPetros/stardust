'use server'

import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'
import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import {
  SupabaseAuthService,
  SupabaseProfileService,
  SupabaseRankingService,
  SupabaseShopService,
  SupabaseSpaceService,
} from '@/api/supabase/services'
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
    await action.handle(actionServer)
  })

export { signUp }
