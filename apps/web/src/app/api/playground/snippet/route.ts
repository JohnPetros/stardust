import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { GetSnippetController } from '@/rest/controllers/playground'
import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabasePlaygroundService } from '@/rest/supabase/services'

export const dynamic = 'force-dynamic'

const schema = z.object({
  routeParams: z.object({
    snippetId: idSchema,
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest) {
  return await runApiRoute(async () => {
    const http = await NextHttp<Schema>({ schema, request })
    const supabase = SupabaseRouteHandlerClient()
    const playgroundService = SupabasePlaygroundService(supabase)
    const controller = GetSnippetController(playgroundService)
    return await controller.handle(http)
  })
}
