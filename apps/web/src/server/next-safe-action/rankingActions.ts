'use server'

import { SupabaseServerActionClient } from '@/api/supabase/clients'
import { SupabaseRankingService } from '@/api/supabase/services'
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
