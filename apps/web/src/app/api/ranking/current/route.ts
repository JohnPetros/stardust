import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabaseRankingService } from '@/api/supabase/services'
import { FetchCurrentRankingController } from '@/api/controllers/ranking'

export async function GET() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const rankingService = SupabaseRankingService(supabase)
    const controller = FetchCurrentRankingController(rankingService)
    return await controller.handle(http)
  })
}
