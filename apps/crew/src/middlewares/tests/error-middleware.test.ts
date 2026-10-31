import { AppError } from '@/errors/app-error'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { describe, expect, it, vi } from 'vitest'

import { ErrorHandler, ErrorMiddleware } from '@/middlewares/error-middleware'

const STATUS_BY_CODE = [
  ['invalid_input', 400],
  ['missing_idempotency_key', 400],
  ['unauthorized', 401],
  ['run_not_found', 404],
  ['review_not_found', 404],
  ['idempotency_conflict', 409],
  ['too_many_runs', 429],
  ['shutting_down', 503],
] as const

const SECRET_MESSAGE = 'connection refused to postgres://user:secret@db/crew'

function buildDatabaseError() {
  return Object.assign(new Error(SECRET_MESSAGE), {
    name: 'PostgresError',
    code: '08006',
  })
}

function createApp(error: unknown, options: { withServerHandler?: boolean } = {}) {
  const app = new Hono()

  app.onError(
    options.withServerHandler
      ? new ErrorHandler().handle
      : (_error, c) => c.text('unhandled', 500),
  )
  app.use('*', new ErrorMiddleware().handle)
  app.get('/boom', () => {
    throw error
  })

  return app
}

describe('ErrorMiddleware', () => {
  it('maps codes and hides internals', async () => {
    for (const [code, status] of STATUS_BY_CODE) {
      const response = await createApp(
        new AppError('Mensagem pública.', 'Título', { code }),
      ).request('/boom')

      expect(response.status).toBe(status)
      expect(await response.json()).toEqual({
        error: { code, message: 'Mensagem pública.' },
      })
    }

    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    const internal = await createApp(buildDatabaseError()).request('/boom')
    const unknownCode = await createApp(
      new AppError('Detalhe interno.', 'Título', { code: 'something_else' }),
    ).request('/boom')

    expect(internal.status).toBe(500)
    expect(await internal.json()).toEqual({ error: { code: 'internal_error' } })
    expect(unknownCode.status).toBe(500)
    expect(await unknownCode.json()).toEqual({ error: { code: 'internal_error' } })
    expect(errorLog).toHaveBeenCalled()

    const logged = errorLog.mock.calls.flat().join('\n')
    expect(logged).toContain('PostgresError (code 08006)')
    expect(logged).not.toContain('secret')
    expect(logged).not.toContain('postgres://')
    expect(logged).not.toContain('Detalhe interno')
    expect(logged).not.toMatch(/\n\s+at /)

    errorLog.mockRestore()
  })

  it('answers once and logs only the error name and code when the server handler runs first', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await createApp(buildDatabaseError(), {
      withServerHandler: true,
    }).request('/boom')
    const mapped = await createApp(
      new AppError('Mensagem pública.', 'Título', { code: 'too_many_runs' }),
      { withServerHandler: true },
    ).request('/boom')

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: { code: 'internal_error' } })
    expect(mapped.status).toBe(429)
    expect(errorLog).toHaveBeenCalledTimes(1)
    expect(errorLog.mock.calls.flat().join('\n')).toContain('PostgresError (code 08006)')
    expect(errorLog.mock.calls.flat().join('\n')).not.toContain('secret')

    errorLog.mockRestore()
  })

  it('keeps the response of a Hono HTTPException and still maps ordinary errors to 500', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    const tooLarge = new HTTPException(413, { message: 'Request body too large' })
    const unavailable = new HTTPException(503, { message: 'Upstream unavailable' })

    for (const options of [{ withServerHandler: false }, { withServerHandler: true }]) {
      const large = await createApp(tooLarge, options).request('/boom')

      expect(large.status).toBe(413)
      expect(await large.text()).toBe('Request body too large')

      const ordinary = await createApp(buildDatabaseError(), options).request('/boom')

      expect(ordinary.status).toBe(500)
      expect(await ordinary.json()).toEqual({ error: { code: 'internal_error' } })
    }

    errorLog.mockClear()
    expect((await createApp(unavailable).request('/boom')).status).toBe(503)
    expect(errorLog).toHaveBeenCalledTimes(1)
    const logged = errorLog.mock.calls.flat().join('\n')
    expect(logged).not.toContain('Upstream unavailable')
    expect(logged).not.toContain('Request body too large')
    expect(logged).not.toContain('secret')

    errorLog.mockRestore()
  })
})
