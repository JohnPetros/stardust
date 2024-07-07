import { NextRequest } from 'next/server'

import { NextHttp } from '@/server/protocols/http'
import { ConfirmEmailController } from '@/server/controllers/auth'
import { SupabaseServerClient } from '@/infra/api/supabase/clients'
import { SupabaseAuthService } from '@/infra/api/supabase/services'

export async function GET(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseServerClient()
  const authService = SupabaseAuthService(supabase)

  const controller = ConfirmEmailController(authService)
  return controller.handle(nextHttp)
}
