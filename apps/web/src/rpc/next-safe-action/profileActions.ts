'use server'

import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { ObsverNewUnlockedAchievementsAction } from '../actions/profile'
import { SupabaseServerActionClient } from '@/rest/supabase/clients'
import { SupabaseProfileService } from '@/rest/supabase/services'

const obsverNewUnlockedAchievements = authActionClient.action(
  async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const profileService = SupabaseProfileService(supabase)
    const action = ObsverNewUnlockedAchievementsAction(profileService)
    return action.handle(call)
  },
)

export { obsverNewUnlockedAchievements }
