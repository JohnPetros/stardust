import { type NextRequest, NextResponse } from 'next/server'

import { CLIENT_ENV, COOKIES } from '@/constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const receipt = request.cookies.get(COOKIES.onboardingAttempt.key)?.value
  if (!receipt) return absentAttempt()
  return fetchAttempt(request, receipt)
    .then(resolveAttemptResponse)
    .catch(() => NextResponse.json(UPSTREAM_ERROR, ERROR_OPTIONS))
}

const EMPTY_ATTEMPT_COOKIE = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: 0,
} as const
const UPSTREAM_ERROR = {
  title: 'Upstream Error',
  message: 'Não foi possível consultar a tentativa.',
}
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' }
const ERROR_OPTIONS = { status: 502, headers: NO_STORE_HEADERS }

function absentAttempt() {
  const response = NextResponse.json(null, { headers: NO_STORE_HEADERS })
  clearAttemptCookie(response)
  return response
}

async function fetchAttempt(request: NextRequest, receipt: string) {
  return fetch(`${CLIENT_ENV.stardustServerUrl}/profile/onboarding-attempt`, {
    headers: { 'X-Onboarding-Receipt': receipt },
    cache: 'no-store',
    signal: request.signal,
    redirect: 'manual',
  })
}

function createAttemptResponse(upstream: Response) {
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      ...NO_STORE_HEADERS,
    },
  })
}

function clearAttemptCookie(response: NextResponse) {
  response.cookies.set(COOKIES.onboardingAttempt.key, '', {
    ...EMPTY_ATTEMPT_COOKIE,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  })
}

function resolveAttemptResponse(upstream: Response) {
  return upstream.status === 401 ? absentAttempt() : createAttemptResponse(upstream)
}
