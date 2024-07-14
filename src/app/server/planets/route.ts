import type { NextRequest } from 'next/server'

import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabasePlanetsService } from '@/infra/api/supabase/services'

import { FetchPlanetsController } from '@/server/controllers/app'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseRouteHandlerClient()
  const planetsService = SupabasePlanetsService(supabase)

  const controller = FetchPlanetsController(planetsService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
