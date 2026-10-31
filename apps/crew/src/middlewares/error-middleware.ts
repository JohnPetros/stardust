import { AppError } from '@/errors/app-error'
import type { MiddlewareHandler } from '@mastra/core/server'

import { describeError } from '@/utils/describe-error'

type RequestContext = Parameters<MiddlewareHandler>[0]

const STATUS_BY_CODE: Record<string, 400 | 401 | 404 | 409 | 429 | 503> = {
  invalid_input: 400,
  missing_idempotency_key: 400,
  unauthorized: 401,
  run_not_found: 404,
  review_not_found: 404,
  idempotency_conflict: 409,
  too_many_runs: 429,
  shutting_down: 503,
}

const ANSWERED_ERRORS = new WeakSet<object>()

function getCode(error: unknown): string | undefined {
  if (!(error instanceof AppError)) return undefined

  const code = error.details?.code
  return typeof code === 'string' ? code : undefined
}

type ResponseCarrier = { status: number; getResponse(): Response }

function isResponseCarrier(error: unknown): error is ResponseCarrier {
  const candidate = error as Partial<ResponseCarrier> | null

  return (
    typeof candidate?.getResponse === 'function' && typeof candidate.status === 'number'
  )
}

function buildResponse(error: unknown, c: RequestContext): Response {
  if (typeof error === 'object' && error !== null) ANSWERED_ERRORS.add(error)

  const code = getCode(error)
  const status = code ? STATUS_BY_CODE[code] : undefined

  if (code && status && error instanceof AppError) {
    return c.json({ error: { code, message: error.message } }, status)
  }

  if (isResponseCarrier(error)) {
    if (error.status >= 500) logUnhandledError(error, c)

    return error.getResponse()
  }

  logUnhandledError(error, c)

  return c.json({ error: { code: 'internal_error' } }, 500)
}

function logUnhandledError(error: unknown, c: RequestContext) {
  const logger = c.get('mastra')?.getLogger?.() ?? console
  logger.error(
    `crew: unhandled error on ${c.req.method} ${c.req.path}: ${describeError(error)}`,
  )
}

export class ErrorMiddleware {
  handle: MiddlewareHandler = async (c, next) => {
    try {
      await next()
    } catch (error) {
      return buildResponse(error, c)
    }

    if (c.error) {
      const error = c.error
      c.error = undefined

      if (!ANSWERED_ERRORS.has(error)) c.res = buildResponse(error, c)
    }
  }
}

export class ErrorHandler {
  handle = (error: Error, c: RequestContext) => buildResponse(error, c)
}
