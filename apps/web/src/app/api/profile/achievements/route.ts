import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseProfileService } from '@/rest/supabase/services'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { FetchAchievementsController } from '@/rest/controllers/profile'

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
