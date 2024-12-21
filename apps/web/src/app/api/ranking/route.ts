import type { NextRequest } from 'next/server'
import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseRouteHandlerClient } from 'SupabaseServerClient'
import {
  SupabaseAuthService,
  SupabaseRankingsService,
  SupabaseUsersService,
} from '@/api/supabase/services'

import { FetchRankingPageDataController } from '@/infra/api/next/controllers/app'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseRouteHandlerClient()
  const authService = SupabaseAuthService(supabase)
  const usersService = SupabaseUsersService(supabase)
  const rankingsService = SupabaseRankingsService(supabase)

  const controller = FetchRankingPageDataController(
    authService,
    usersService,
    rankingsService,
  )

  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
