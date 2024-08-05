import { NextHttp } from '@/infra/api/next/http'
import { FetchPlanetsController } from '@/infra/api/next/controllers/app'

import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabaseSpaceService } from '@/infra/api/supabase/services'

export async function GET() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const spaceService = SupabaseSpaceService(supabase)

  const controller = FetchPlanetsController(spaceService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
