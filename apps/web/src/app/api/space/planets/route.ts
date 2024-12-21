import { NextHttp } from '@/api/next/NextHttp'
import { FetchPlanetsController } from '@/infra/api/next/controllers/app'

import { SupabaseRouteHandlerClient } from 'SupabaseServerClient'
import { SupabaseSpaceService } from '@/api/supabase/services'

export async function GET() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const spaceService = SupabaseSpaceService(supabase)

  const controller = FetchPlanetsController(spaceService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
