import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabasePlanetsService } from '@/infra/api/supabase/services'

import { FetchPlanetsController } from '@/server/controllers/app'

export async function GET() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const planetsService = SupabasePlanetsService(supabase)

  const controller = FetchPlanetsController(planetsService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
