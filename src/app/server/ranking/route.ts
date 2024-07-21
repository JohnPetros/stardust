import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabaseRankingsService,
  SupabaseUsersService,
} from '@/infra/api/supabase/services'

import { FetchRankingPageDataController } from '@/server/controllers/app'

export const dynamic = 'force-static'

export async function GET() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const authService = SupabaseAuthService(supabase)
  const usersService = SupabaseUsersService(supabase)
  const rankingsService = SupabaseRankingsService(supabase)

  const controller = FetchRankingPageDataController(
    authService,
    usersService,
    rankingsService
  )

  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
