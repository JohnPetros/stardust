import type { NextRequest } from 'next/server'

import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseProfileService, SupabaseSpaceService } from '@/api/supabase/services'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { RewardUserController } from '@/api/controllers/lesson'
import { runApiRoute } from '@/api/next/utils'

export async function POST(request: NextRequest) {
  await runApiRoute(async () => {
    const http = await NextHttp({ request })
    const supabase = SupabaseRouteHandlerClient()
    const profileService = SupabaseProfileService(supabase)
    const spaceService = SupabaseSpaceService(supabase)
    const controller = RewardUserController(profileService, spaceService)
    const httpResponse = await controller.handle(http)
    return httpResponse.body
  })
}
