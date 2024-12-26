import type { NextRequest } from 'next/server'

import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseProfileService, SupabaseSpaceService } from '@/api/supabase/services'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { RewardUserController } from '@/api/controllers/profile'
import { runApiRoute } from '@/api/next/utils'

export async function POST(request: NextRequest) {
  await runApiRoute(async () => {
    const http = await NextHttp({ request })
    const supabase = SupabaseRouteHandlerClient()
    const profileService = SupabaseProfileService(supabase)
    const spaceService = SupabaseSpaceService(supabase)
    const controller = RewardUserController(profileService, spaceService)
    return await controller.handle(http)
  })
}
