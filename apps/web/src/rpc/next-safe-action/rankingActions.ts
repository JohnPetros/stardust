'use server'

import { SupabaseServerActionClient } from '@/rest/supabase/clients'
import { SupabaseRankingService } from '@/rest/supabase/services'
import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { GetLastWeekRankingWinnersAction } from '../actions/ranking'

const getLastWeekRankingWinners = authActionClient.action(
  async ({ clientInput, ctx }) => {
    const actionServer = NextActionServer({
      request: clientInput,
      user: ctx.user,
    })
    const supabase = SupabaseServerActionClient()
    const rankingService = SupabaseRankingService(supabase)
    const action = GetLastWeekRankingWinnersAction(rankingService)
    return action.handle(actionServer)
  },
)

export { getLastWeekRankingWinners }
