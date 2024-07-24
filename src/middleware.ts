import { type NextRequest, NextResponse } from 'next/server'

import { VerifyAuthRoutesController } from './server/controllers/auth'
import { NextHttp } from './server/protocols/http'
import { HandleRewardsPayloadController } from './server/controllers/app'
import { SupabaseMiddlewareClient } from './infra/api/supabase/clients'
import { SupabaseAuthService } from './infra/api/supabase/services'
import { HandleRedirectController } from './server/controllers/global'

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next()
  const nextHttp = NextHttp(request)

  const supabase = SupabaseMiddlewareClient(request)
  const authService = SupabaseAuthService(supabase)

  const controllers = [
    VerifyAuthRoutesController(authService),
    HandleRewardsPayloadController(),
    HandleRedirectController(),
  ]

  for (const controller of controllers) {
    const constrollerResponse = await controller.handle(nextHttp)
    if (constrollerResponse.body) return constrollerResponse.body
  }

  return response
}

export const config = { matcher: '/((?!.*\\.).*)' }
