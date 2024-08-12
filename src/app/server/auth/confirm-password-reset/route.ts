import type { NextRequest } from 'next/server'

import { NextHttp } from '@/infra/api/next/http'
import { ConfirmPasswordResetController } from '@/infra/api/next/controllers/auth'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import { SupabaseAuthService } from '@/infra/api/supabase/services'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseRouteHandlerClient()
  const authService = SupabaseAuthService(supabase)

  const controller = ConfirmPasswordResetController(authService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
