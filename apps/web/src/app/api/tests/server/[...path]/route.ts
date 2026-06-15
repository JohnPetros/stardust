import type { NextRequest } from 'next/server'

import { SERVER_ENV } from '@/constants/server-env'
import { findServerMockRoute } from '@/app/tests/shared/mocks/ServerMockRegistry'

export const dynamic = 'force-dynamic'

type RouteContext = {
  params: Promise<{
    path: string[]
  }>
}

function notFoundResponse() {
  return Response.json({ message: 'Not Found' }, { status: 404 })
}

async function getRequestPath(context: RouteContext) {
  const { path } = await context.params
  const pathSegments = path ?? []
  return `/${pathSegments.join('/')}`
}

function getRequestQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries())
}

async function waitRouteDelay(delayInMs?: number) {
  if (!delayInMs) return

  await new Promise((resolve) => {
    setTimeout(resolve, delayInMs)
  })
}

async function buildRouteResponse(request: NextRequest, context: RouteContext) {
  if (SERVER_ENV.mode !== 'testing') {
    return notFoundResponse()
  }

  const path = await getRequestPath(context)
  const route = findServerMockRoute({
    method: request.method,
    path,
    query: getRequestQuery(request),
  })

  if (!route) {
    return Response.json(
      {
        title: 'Server mock route not found',
        message: `Unmocked request: ${request.method.toUpperCase()} ${path}`,
      },
      { status: 500 },
    )
  }

  await waitRouteDelay(route.delayInMs)

  return Response.json(route.body ?? null, {
    status: route.status ?? 200,
    headers: route.headers,
  })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return await buildRouteResponse(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return await buildRouteResponse(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return await buildRouteResponse(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return await buildRouteResponse(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return await buildRouteResponse(request, context)
}
