import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabaseRankingService } from '@/rest/supabase/services'
import { FetchCurrentRankingController } from '@/rest/controllers/ranking'

export const dynamic = 'force-dynamic'

export async function GET() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const rankingService = SupabaseRankingService(supabase)
    const controller = FetchCurrentRankingController(rankingService)
    return await controller.handle(http)
  })
}
