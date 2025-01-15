import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { GetSnippetController } from '@/api/controllers/playground'
import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabasePlaygroundService } from '@/api/supabase/services'

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
