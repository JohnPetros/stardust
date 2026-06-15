import { z } from 'zod'

import { SERVER_ENV } from '@/constants/server-env'
import {
  registerServerMockRoutes,
  resetServerMockRoutes,
} from '@/app/tests/shared/mocks/ServerMockRegistry'

const schema = z.object({
  routes: z.array(
    z.object({
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
      path: z.string(),
      query: z.record(z.string()).optional(),
      status: z.number().optional(),
      delayInMs: z.number().optional(),
      body: z.unknown().optional(),
      headers: z.record(z.string()).optional(),
    }),
  ),
})

export const dynamic = 'force-dynamic'

function notFoundResponse() {
  return Response.json({ message: 'Not Found' }, { status: 404 })
}

export async function GET() {
  if (SERVER_ENV.mode !== 'testing') {
    return notFoundResponse()
  }

  return Response.json({ ok: true })
}

export async function PUT(request: Request) {
  if (SERVER_ENV.mode !== 'testing') {
    return notFoundResponse()
  }

  const body = await request.json()
  const { routes } = schema.parse(body)

  registerServerMockRoutes(routes)

  return Response.json({ ok: true })
}

export async function DELETE() {
  if (SERVER_ENV.mode !== 'testing') {
    return notFoundResponse()
  }

  resetServerMockRoutes()

  return Response.json({ ok: true })
}
