import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'
import { ZodValidationErrorFactory } from '@stardust/validation/factories'

import { CLIENT_ENV, COOKIES } from '@/constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (isForbiddenSignUpOrigin(request)) return createFailureResponse(FORBIDDEN_BODY, 403)
  const body = await readSignUpBody(request)
  if (body instanceof NextResponse) return body
  return fetchSignUp(request, body)
    .then(createSignUpResponse)
    .catch(() => createFailureResponse(UPSTREAM_ERROR, 502))
}

const schema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

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

const ATTEMPT_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/api/auth',
} as const
const FORBIDDEN_BODY = { title: 'Forbidden', message: 'Origem não autorizada.' }
const UPSTREAM_ERROR = {
  title: 'Upstream Error',
  message: 'Não foi possível realizar o cadastro.',
}
const VALIDATION_BODY = { title: 'Validation Error', fieldErrors: [] }

function getAttemptMaxAge(expiresAt: Date) {
  const durationInSeconds = COOKIES.onboardingAttempt.durationInSeconds
  const remainingSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
  return Math.max(0, Math.min(durationInSeconds, remainingSeconds))
}

function getAttemptLifetime(maxAge: number, expiresAt?: Date) {
  return {
    maxAge,
    expires: expiresAt
      ? new Date(Math.min(expiresAt.getTime(), Date.now() + maxAge * 1000))
      : new Date(0),
  }
}

function setAttemptCookie(response: NextResponse, value = '', expiresAt?: Date) {
  const maxAge = expiresAt ? getAttemptMaxAge(expiresAt) : 0
  applyAttemptCookie(response, value, maxAge, expiresAt)
  return response
}

function createFailureResponse(body: unknown, status: number) {
  return setAttemptCookie(
    NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } }),
  )
}

function createValidationResponse(error: unknown) {
  const { title, fieldErrors } =
    error instanceof z.ZodError
      ? ZodValidationErrorFactory.produce(error)
      : VALIDATION_BODY
  return createFailureResponse({ title, fieldErrors }, 400)
}

function createForwardedResponse(upstream: Response) {
  const headers = new Headers(upstream.headers)
  for (const key of PRIVATE_RESPONSE_HEADERS) headers.delete(key)
  headers.set('Cache-Control', 'no-store')
  return new NextResponse(upstream.body, { status: upstream.status, headers })
}

function getAttemptReceipt(upstream: Response) {
  const { receipt, expiry } = readAttemptMetadata(upstream)
  if (!upstream.ok || !receipt) return null
  const expiryTime = expiry.getTime()
  if (!Number.isFinite(expiryTime) || expiryTime <= Date.now()) return null
  return { receipt, expiry }
}

function createSignUpResponse(upstream: Response) {
  const response = createForwardedResponse(upstream)
  const attempt = getAttemptReceipt(upstream)
  return attempt
    ? setAttemptCookie(response, attempt.receipt, attempt.expiry)
    : setAttemptCookie(response)
}

async function readSignUpBody(request: NextRequest) {
  try {
    return schema.parse(await request.json())
  } catch (error) {
    return createValidationResponse(error)
  }
}

async function fetchSignUp(request: NextRequest, body: z.infer<typeof schema>) {
  return fetch(`${CLIENT_ENV.stardustServerUrl}/auth/sign-up`, {
    method: 'POST',
    ...createSignUpPayload(body),
    cache: 'no-store',
    signal: request.signal,
    redirect: 'manual',
  })
}

function readAttemptMetadata(upstream: Response) {
  return {
    receipt: upstream.headers.get('x-onboarding-receipt'),
    expiry: new Date(upstream.headers.get('x-onboarding-expires-at') ?? ''),
  }
}

function createSignUpPayload(body: z.infer<typeof schema>) {
  return { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
}

function applyAttemptCookie(
  response: NextResponse,
  value: string,
  maxAge: number,
  expiresAt?: Date,
) {
  response.cookies.set(COOKIES.onboardingAttempt.key, value, {
    ...ATTEMPT_COOKIE_OPTIONS,
    secure: process.env.NODE_ENV === 'production',
    ...getAttemptLifetime(maxAge, expiresAt),
  })
}

function isForbiddenSignUpOrigin(request: NextRequest) {
  return request.headers.get('origin') !== new URL(CLIENT_ENV.stardustWebUrl).origin
}
