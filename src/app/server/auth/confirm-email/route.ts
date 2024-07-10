import { NextRequest } from 'next/server'

import { NextHttp } from '@/server/protocols/http'
import { ConfirmEmailController } from '@/server/controllers/auth'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabaseAuthService } from '@/infra/api/supabase/services'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseRouteHandlerClient()
  const authService = SupabaseAuthService(supabase)

  const controller = ConfirmEmailController(authService)
  const httpResponse = await controller.handle(nextHttp)

  return await httpResponse.body
}
