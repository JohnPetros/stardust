import { type NextRequest, NextResponse } from 'next/server'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { VerifyAuthRoutesController } from './rest/controllers/auth'
import { NextHttp } from './rest/next/NextHttp'
import { HandleRewardingPayloadController } from './rest/controllers/lesson'
import { HandleRedirectController } from './rest/controllers/global'
import { AuthService } from './rest/services'
import { NextServerRestClient } from './rest/next/NextServerRestClient'
import { ROUTES } from './constants'

const PUBLIC_ROUTES = [
  ROUTES.landing,
  ROUTES.playground.snippets,
  ...Object.values(ROUTES.seo),
  ...Object.values(ROUTES.auth),
  ...Object.values(ROUTES.api.auth),
]

const PUBLIC_ROUTE_GROUPS = [
  '/challenging/challenges',
  '/playground/snippets/',
  '/api/conversation',
]

export const middleware = async (request: NextRequest) => {
  const http = await NextHttp({ request })
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const controllers = [
    VerifyAuthRoutesController(authService),
    HandleRewardingPayloadController(),
    HandleRedirectController(),
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
          message: 'Nao autorizado.',
        },
        { status: HTTP_STATUS_CODE.unauthorized },
      )
    }

    return NextResponse.redirect(new URL(ROUTES.auth.signIn, request.url))
  }

  if (isApiRoute && isPublicRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)',
  ],
}
