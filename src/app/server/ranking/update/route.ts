import { NextHttp } from '@/infra/api/next/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabaseRankingsService } from '@/infra/api/supabase/services'

import { UpdateRakingsController } from '@/infra/api/next/controllers/app'

export async function POST() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const rankingsService = SupabaseRankingsService(supabase)

  const controller = UpdateRakingsController(rankingsService)

  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
