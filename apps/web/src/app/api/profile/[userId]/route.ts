import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import type { NextParams } from '@/server/next/types'
import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseProfileService } from '@/api/supabase/services'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { AccessProfilePageController } from '@/api/controllers/profile'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const schema = z.object({
  routeParams: z.object({
    userId: idSchema,
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest, params: NextParams) {
  return runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, params, schema })
    const supabase = SupabaseRouteHandlerClient()
    const service = SupabaseProfileService(supabase)
    const controller = AccessProfilePageController(service)
    return await controller.handle(http)
  })
}
