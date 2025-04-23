import { UpdateRakingsController } from '@/rest/controllers/ranking'
import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabaseRankingService } from '@/rest/supabase/services'

export async function PUT() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const rankingService = SupabaseRankingService(supabase)
    const controller = UpdateRakingsController(rankingService)
    return await controller.handle(http)
  })
}
