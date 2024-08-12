import type { NextRequest } from 'next/server'

import { NextHttp } from '@/infra/api/next/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabaseUsersService,
  SupabaseSpaceService,
} from '@/infra/api/supabase/services'

import { RewardUserController } from '@/infra/api/next/controllers/app'

export async function POST(request: NextRequest) {
  const nextHttp = NextHttp(request)

  const supabase = SupabaseRouteHandlerClient()
  const authService = SupabaseAuthService(supabase)
  const usersService = SupabaseUsersService(supabase)
  const spaceService = SupabaseSpaceService(supabase)

  const controller = RewardUserController(authService, usersService, spaceService)

  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
