import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabaseChallengingService } from '@/rest/supabase/services'
import { FetchChallengesListController } from '@/rest/controllers/challenging'
import { itemsPerPageSchema, pageSchema } from '@stardust/validation/global/schemas'
import {
  challengeDifficultyLevelSchema,
  challengeCompletionStatusSchema,
} from '@stardust/validation/challenging/schemas'

export const dynamic = 'force-dynamic'

const schema = z.object({
  queryParams: z.object({
    page: pageSchema.optional().default(1),
    itemsPerPage: itemsPerPageSchema,
    difficultyLevel: challengeDifficultyLevelSchema.optional().default('all'),
    completionStatus: challengeCompletionStatusSchema.optional().default('all'),
    title: z.string().optional().default(''),
    categoriesIds: z.string().optional().default(''),
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
