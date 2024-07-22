import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabaseRankingsService } from '@/infra/api/supabase/services'

import { UpdateRakingsController } from '@/server/controllers/app'

export async function POST() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const rankingsService = SupabaseRankingsService(supabase)

  const controller = UpdateRakingsController(rankingsService)

  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
