import type { NextRequest } from 'next/server'

import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseRouteHandlerClient } from 'SupabaseServerClient'
import {
  SupabaseAuthService,
  SupabaseUsersService,
  SupabaseSpaceService,
} from '@/api/supabase/services'

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
