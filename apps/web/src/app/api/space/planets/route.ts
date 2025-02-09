import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { FetchPlanetsController } from '@/api/controllers/space'
import { SupabaseSpaceService } from '@/api/supabase/services'

export async function GET() {
  return runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseServerClient()
    const spaceService = SupabaseSpaceService(supabase)
    const controller = FetchPlanetsController(spaceService)
    return await controller.handle(http)
  })
}
