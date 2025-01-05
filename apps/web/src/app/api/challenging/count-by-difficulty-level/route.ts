import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { CountCompletedChallengesByDifficultyLevelController } from '@/api/controllers/challenging'

export async function GET() {
  return await runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const challengingService = SupabaseChallengingService(supabase)
    const controller =
      CountCompletedChallengesByDifficultyLevelController(challengingService)
    return await controller.handle(http)
  })
}
