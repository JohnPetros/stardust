import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { ObsverNewUnlockedAchievementsAction } from '../actions/profile'
import { SupabaseServerActionClient } from '@/api/supabase/clients'
import { SupabaseProfileService } from '@/api/supabase/services'

const obsverNewUnlockedAchievements = authActionClient.action(
  async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const profileService = SupabaseProfileService(supabase)
    const action = ObsverNewUnlockedAchievementsAction(profileService)
    return action.handle(actionServer)
  },
)

export const profileActions = { obsverNewUnlockedAchievements }
