import { type NextRequest, NextResponse } from 'next/server'

import { CLIENT_ENV, COOKIES } from '@/constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const headers = createStreamRequestHeaders(request)
  if (!headers) return createAnonymousStreamResponse()
  return fetchStream(request, headers)
    .then(createStreamResponse)
    .catch(() => NextResponse.json(UPSTREAM_ERROR, ERROR_OPTIONS))
}

const PRIVATE_RESPONSE_HEADERS = [
  'x-onboarding-receipt',
  'x-onboarding-expires-at',
  'x-onboarding-signup-eligible',
  'set-cookie',
  'access-control-expose-headers',
  'content-encoding',
  'content-length',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]

function createStreamResponse(upstream: Response) {
  const headers = new Headers(upstream.headers)
  for (const key of PRIVATE_RESPONSE_HEADERS) headers.delete(key)
  headers.set('Cache-Control', 'no-store, no-transform')
  headers.set('X-Accel-Buffering', 'no')
  return new NextResponse(upstream.body, { status: upstream.status, headers })
}

const UPSTREAM_ERROR = {
  title: 'Upstream Error',
  message: 'Não foi possível abrir a conexão.',
}
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' }
const ERROR_OPTIONS = { status: 502, headers: NO_STORE_HEADERS }

function getAuthorization(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  if (authorization !== null) return authorization
  const accessToken = request.cookies.get(COOKIES.accessToken.key)?.value
  return accessToken ? `Bearer ${accessToken}` : null
}

function createStreamRequestHeaders(request: NextRequest) {
  const authorization = getAuthorization(request)
  const receipt = request.cookies.get(COOKIES.onboardingAttempt.key)?.value
  return createCredentialHeaders(authorization, receipt)
}

async function fetchStream(request: NextRequest, headers: Headers) {
  return fetch(`${CLIENT_ENV.stardustServerUrl}/profile/events`, {
    headers,
    cache: 'no-store',
    signal: request.signal,
    redirect: 'manual',
  })
}

function createCredentialHeaders(
  authorization: string | null,
  receipt: string | undefined,
) {
  const headers = new Headers({ Accept: 'text/event-stream' })
  if (authorization !== null) headers.set('Authorization', authorization)
  else if (receipt) headers.set('X-Onboarding-Receipt', receipt)
  else return null
  return headers
}

function createAnonymousStreamResponse() {
  return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS })
}
