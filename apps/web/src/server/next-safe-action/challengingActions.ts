import { SupabaseServerActionClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { CountCompletedChallengesByDifficultyLevelAction } from '../actions/challenging'

const countCompletedChallengesByDifficultyLevel = authActionClient.action(
  async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const challengingService = SupabaseChallengingService(supabase)
    const action = CountCompletedChallengesByDifficultyLevelAction(challengingService)
    return action.handle(actionServer)
  },
)

export const challengingActions = { countCompletedChallengesByDifficultyLevel }
