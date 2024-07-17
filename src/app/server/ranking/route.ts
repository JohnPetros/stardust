import type { NextRequest } from 'next/server'

import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabaseRankingsService,
  SupabaseUsersService,
} from '@/infra/api/supabase/services'

import { FetchRankingPageDataController } from '@/server/controllers/app'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

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
