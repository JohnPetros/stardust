import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseRouteHandlerClient } from 'SupabaseServerClient'
import { SupabaseRankingsService } from '@/api/supabase/services'

import { UpdateRakingsController } from '@/infra/api/next/controllers/app'

export async function POST() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const rankingsService = SupabaseRankingsService(supabase)

  const controller = UpdateRakingsController(rankingsService)

  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
