import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { FetchPlanetsController } from '@/rest/controllers/space'
import { SupabaseSpaceService } from '@/rest/supabase/services'

export const dynamic = 'force-dynamic'

export async function GET() {
  return runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseServerClient()
    const spaceService = SupabaseSpaceService(supabase)
    const controller = FetchPlanetsController(spaceService)
    return await controller.handle(http)
  })
}
