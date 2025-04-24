import { z } from 'zod'
import type { NextRequest } from 'next/server'

import { NextHttp } from '@/rest/next/NextHttp'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabaseAuthService } from '@/rest/supabase/services'
import { ConfirmPasswordResetController } from '@/rest/controllers/auth'
import { runApiRoute } from '@/rest/next/utils'

export const dynamic = 'force-dynamic'

const schema = z.object({
  queryParams: z.object({
    token: z.string({ required_error: 'token é obrigatório' }),
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest) {
  return runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, schema })
    const supabase = SupabaseRouteHandlerClient()
    const authService = SupabaseAuthService(supabase)
    const controller = ConfirmPasswordResetController(authService)
    return await controller.handle(http)
  })
}
