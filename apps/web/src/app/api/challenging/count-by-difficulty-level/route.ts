import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabaseChallengingService } from '@/rest/supabase/services'
import { CountCompletedChallengesByDifficultyLevelController } from '@/rest/controllers/challenging'

export const dynamic = 'force-dynamic'

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
