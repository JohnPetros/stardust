import { type NextRequest, NextResponse } from 'next/server'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { VerifyAuthRoutesController } from './rest/controllers/auth'
import { NextHttp } from './rest/next/NextHttp'
import { HandleRewardingPayloadController } from './rest/controllers/lesson'
import { AuthService } from './rest/services'
import { NextServerRestClient } from './rest/next/NextServerRestClient'
import { PUBLIC_ROUTE_GROUPS, PUBLIC_ROUTES, ROUTES } from './constants'

export const middleware = async (request: NextRequest) => {
  const http = await NextHttp({ request })
  const restClient = await NextServerRestClient({ isCacheEnabled: false })

  const authService = AuthService(restClient)
  const controllers = [
    VerifyAuthRoutesController(authService),
    HandleRewardingPayloadController(),
  ]

  const currentRoute = request.nextUrl.pathname

  const isPublicRoute =
    PUBLIC_ROUTES.map(String).includes(currentRoute) ||
    PUBLIC_ROUTE_GROUPS.some((group) => currentRoute.startsWith(group))

  const isApiRoute = currentRoute.startsWith('/api/')

  try {
    for (const controller of controllers) {
      const response = await controller.handle(http)
      if (response.isRedirecting) return response.body
    }
  } catch (error) {
    console.error('Middleware auth flow failed', error)

    if (isPublicRoute) {
      return NextResponse.next()
    }

    if (isApiRoute) {
      return NextResponse.json(
        {
          title: 'Unauthorized',
          message: 'Não autorizado.',
        },
        { status: HTTP_STATUS_CODE.unauthorized },
      )
    }

    return NextResponse.redirect(new URL(ROUTES.auth.signIn, request.url))
  }

  console.log('Middleware auth flow started 2')

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)',
  ],
}
