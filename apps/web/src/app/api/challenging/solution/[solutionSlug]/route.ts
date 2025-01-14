import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { AccessSolutionPageController } from '@/api/controllers/challenging'
import { stringSchema } from '@stardust/validation/global/schemas'

const schema = z.object({
  routeParams: z.object({
    solutionSlug: stringSchema,
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest) {
  return await runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, schema })
    const supabase = SupabaseRouteHandlerClient()
    const challengingService = SupabaseChallengingService(supabase)
    const controller = AccessSolutionPageController(challengingService)
    return await controller.handle(http)
  })
}
