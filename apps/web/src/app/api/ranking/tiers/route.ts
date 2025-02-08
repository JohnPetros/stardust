import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRankingService } from '@/api/supabase/services'
import { FetchTiersController } from '@/api/controllers/ranking'
import { SupabaseServerClient } from '@/api/supabase/clients'

export async function GET() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseServerClient()
    const service = SupabaseRankingService(supabase)
    const controller = FetchTiersController(service)
    return await controller.handle(http)
  })
}
