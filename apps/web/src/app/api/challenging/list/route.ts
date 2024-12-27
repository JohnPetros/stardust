import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { FetchChallengesListController } from '@/api/controllers/challenging'

const schema = z.object({
  queryParams: z.object({
    title: z.string().optional().default(''),
    difficultyLevel: z.enum(['all', 'easy', 'medium', 'hard']).optional().default('all'),
    categoriesIds: z.string().optional().default(''),
    completionStatus: z
      .enum(['completed', 'not-completed', 'all'])
      .optional()
      .default('all'),
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest) {
  return await runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, schema })
    const supabase = SupabaseRouteHandlerClient()
    const challengingService = SupabaseChallengingService(supabase)
    const controller = FetchChallengesListController(challengingService)
    return await controller.handle(http)
  })
}
