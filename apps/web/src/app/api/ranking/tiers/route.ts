import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseRankingService } from '@/rest/supabase/services'
import { FetchTiersController } from '@/rest/controllers/ranking'
import { SupabaseServerClient } from '@/rest/supabase/clients'

export const dynamic = 'force-dynamic'

export async function GET() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseServerClient()
    const service = SupabaseRankingService(supabase)
    const controller = FetchTiersController(service)
    return await controller.handle(http)
  })
}
