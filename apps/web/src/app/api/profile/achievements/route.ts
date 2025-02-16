import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseProfileService } from '@/api/supabase/services'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { FetchAchievementsController } from '@/api/controllers/profile'

export const dynamic = 'force-dynamic'

export async function GET() {
  return runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const service = SupabaseProfileService(supabase)
    const controller = FetchAchievementsController(service)
    return await controller.handle(http)
  })
}
