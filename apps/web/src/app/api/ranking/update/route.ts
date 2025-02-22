import { UpdateRakingsController } from '@/api/controllers/ranking'
import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabaseRankingService } from '@/api/supabase/services'

export async function PUT() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const rankingService = SupabaseRankingService(supabase)
    const controller = UpdateRakingsController(rankingService)
    return await controller.handle(http)
  })
}
