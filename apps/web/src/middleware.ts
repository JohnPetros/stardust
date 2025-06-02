import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { VerifyAuthRoutesController } from './rest/controllers/auth'
import { NextHttp } from './rest/next/NextHttp'
import { HandleRewardsPayloadController } from './rest/controllers/lesson'
import { HandleRedirectController } from './rest/controllers/global'
import { AuthService } from './rest/services'
import { NextServerRestClient } from './rest/next/NextServerRestClient'

const schema = z.object({
  queryParams: z
    .object({
      redirect_to: z.string().optional(),
    })
    .optional(),
})

type Schema = z.infer<typeof schema>

export const middleware = async (request: NextRequest) => {
  const http = await NextHttp<Schema>({ request, schema })
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const controllers = [
    VerifyAuthRoutesController(authService),
    HandleRewardsPayloadController(),
    HandleRedirectController(),
  ]

  try {
    for (const controller of controllers) {
      const response = await controller.handle(http)
      if (response.isRedirecting) return response.body
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
