import type { NextRequest } from 'next/server'

import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabaseAchievementsService } from '@/infra/api/supabase/services'
import { FetchAchievementsController } from '@/server/controllers/app'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseRouteHandlerClient()
  const service = SupabaseAchievementsService(supabase)

  const controller = FetchAchievementsController(service)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
