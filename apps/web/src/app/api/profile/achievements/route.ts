import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseProfileService } from '@/api/supabase/services'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import {} from '@/api/controllers/profile'

export async function GET() {
  const http = NextHttp()
  const supabase = SupabaseRouteHandlerClient()
  const service = SupabaseProfileService(supabase)

  const controller = FetchAchievementsController(service)
  const reponse = await controller.handle(http)

  return reponse.body
}
