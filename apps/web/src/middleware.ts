import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { VerifyAuthRoutesController } from './rest/controllers/auth'
import { NextHttp } from './rest/next/NextHttp'
import { HandleRewardsPayloadController } from './rest/controllers/lesson'
import { SupabaseMiddlewareClient } from './rest/supabase/clients/SupabaseMiddlewareClient'
import { SupabaseAuthService } from './rest/supabase/services'
import { HandleRedirectController } from './rest/controllers/global'

const schema = z.object({
  queryParams: z
    .object({
      redirect_to: z.string().optional(),
    })
    .optional(),
})

export const middleware = async (request: NextRequest) => {
  const http = await NextHttp<z.infer<typeof schema>>({ request, schema })
  const supabase = SupabaseMiddlewareClient(request)
  const authService = SupabaseAuthService(supabase)
  const controllers = [
    VerifyAuthRoutesController(authService),
    HandleRewardsPayloadController(),
    HandleRedirectController(),
  ]

  try {
    for (const controller of controllers) {
      const constrollerResponse = await controller.handle(http)
      if (constrollerResponse.isRedirecting) return constrollerResponse.body
    }
  } catch (error) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
