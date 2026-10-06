/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET, dynamic, runtime } from '../route'
import { resetServerMockRoutes } from '@/app/tests/shared/mocks/ServerMockRegistry'
import { GET as mockGET } from '@/app/api/tests/server/[...path]/route'
import { PUT as registerMocks } from '@/app/api/tests/server/route'
import { ServerMock } from '@/app/tests/shared/mocks/ServerMock'
import type { Page } from '@playwright/test'

jest.mock('@/constants', () => ({
  CLIENT_ENV: { stardustServerUrl: 'http://upstream.test' },
  COOKIES: {
    onboardingAttempt: { key: '@stardust:onboarding-attempt' },
    accessToken: { key: '@stardust:access-token' },
  },
}))
jest.mock('@/constants/server-env', () => ({ SERVER_ENV: { mode: 'testing' } }))
const fetchMock = jest.fn()
function request(headers: Record<string, string> = {}, signal?: AbortSignal) {
  return new NextRequest(
    'http://web.test/api/auth/profile-events?accountId=forbidden&receipt=forbidden',
    { headers, signal },
  )
}

describe('GET /api/auth/profile-events', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock
  })
  afterEach(() => {
    resetServerMockRoutes()
  })

  it('stops anonymous connections with 204 and no upstream request', async () => {
    const response = await GET(request())
    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('gives an explicit bearer precedence over cookies and preserves 401 without receipt fallback', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ title: 'Unauthorized' }, { status: 401 }),
    )
    const response = await GET(
      request({
        Authorization: 'Bearer invalid-fixture',
        Cookie:
          '@stardust:access-token=cookie-fixture; @stardust:onboarding-attempt=receipt-fixture',
      }),
    )
    expect(response.status).toBe(401)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const headers: Headers = fetchMock.mock.calls[0][1].headers
    expect(headers.get('authorization')).toBe('Bearer invalid-fixture')
    expect(headers.has('x-onboarding-receipt')).toBe(false)
    expect(headers.has('cookie')).toBe(false)
  })

  it('does not fall back for an explicitly empty authorization header', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }))
    await GET(
      request({ Authorization: '', Cookie: '@stardust:onboarding-attempt=fixture' }),
    )
    const headers: Headers = fetchMock.mock.calls[0][1].headers
    expect(headers.get('authorization')).toBe('')
    expect(headers.has('x-onboarding-receipt')).toBe(false)
  })

  it('forwards the session cookie as bearer before the receipt', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    await GET(
      request({
        Cookie:
          '@stardust:access-token=fixture; @stardust:onboarding-attempt=receipt-fixture',
      }),
    )
    const headers: Headers = fetchMock.mock.calls[0][1].headers
    expect(headers.get('authorization')).toBe('Bearer fixture')
    expect(headers.has('x-onboarding-receipt')).toBe(false)
  })

  it('forwards receipt without selectors and streams frames before upstream completion', async () => {
    let streamController: ReadableStreamDefaultController<Uint8Array> | undefined
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        streamController = controller
      },
    })
    const upstream = new Response(body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'X-Onboarding-Receipt': 'forbidden',
        'Set-Cookie': 'forbidden=fixture',
        'Content-Encoding': 'gzip',
        'Content-Length': '9999',
        Connection: 'keep-alive',
        'Keep-Alive': 'timeout=5',
        'Proxy-Authenticate': 'Basic',
        'Proxy-Authorization': 'fixture',
        TE: 'trailers',
        Trailer: 'fixture',
        'Transfer-Encoding': 'chunked',
        Upgrade: 'fixture',
        'Retry-After': '1',
      },
    })
    const text = jest.spyOn(upstream, 'text')
    fetchMock.mockResolvedValueOnce(upstream)
    const incoming = request({
      Cookie: '@stardust:onboarding-attempt=fixture; unrelated=forbidden',
    })
    const response = await GET(incoming)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://upstream.test/profile/events',
      expect.objectContaining({ cache: 'no-store', signal: incoming.signal }),
    )
    const headers: Headers = fetchMock.mock.calls[0][1].headers
    expect(headers.get('x-onboarding-receipt')).toBe('fixture')
    expect(headers.has('authorization')).toBe(false)
    expect(headers.has('cookie')).toBe(false)
    expect(response.headers.get('content-type')).toBe('text/event-stream')
    expect(response.headers.get('cache-control')).toBe('no-store, no-transform')
    expect(response.headers.get('x-accel-buffering')).toBe('no')
    expect(response.headers.has('x-onboarding-receipt')).toBe(false)
    expect(response.headers.has('set-cookie')).toBe(false)
    for (const header of [
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
    ])
      expect(response.headers.has(header)).toBe(false)
    expect(response.headers.get('retry-after')).toBe('1')
    const reader = response.body?.getReader()
    streamController?.enqueue(new TextEncoder().encode('retry: 1000\n\n'))
    expect(new TextDecoder().decode((await reader?.read())?.value)).toBe(
      'retry: 1000\n\n',
    )
    streamController?.close()
    expect((await reader?.read())?.done).toBe(true)
    expect(text).not.toHaveBeenCalled()
    expect(runtime).toBe('nodejs')
    expect(dynamic).toBe('force-dynamic')
  })

  it('propagates browser abort to upstream and downstream cancellation to its stream', async () => {
    const abort = new AbortController()
    const cancel = jest.fn()
    const body = new ReadableStream({ cancel })
    let upstreamAborted = false
    fetchMock.mockImplementationOnce(async (_url, init) => {
      init.signal.addEventListener('abort', () => {
        upstreamAborted = true
      })
      return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
    })
    const response = await GET(request({ Authorization: 'Bearer fixture' }, abort.signal))
    abort.abort()
    expect(upstreamAborted).toBe(true)
    await response.body?.cancel()
    expect(cancel).toHaveBeenCalledTimes(1)
  })

  it('does not manufacture a successful stream when upstream is unavailable', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'))
    const response = await GET(request({ Authorization: 'Bearer fixture' }))
    expect(response.status).toBe(502)
    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('round trips explicitly encoded finite raw frames through test-only registration without changing normal JSON bodies', async () => {
    const rawBody =
      'retry: 1000\n\nevent: user.created\nid: profile:fixture\ndata: {"userId":"fixture","userName":"Fixture","userEmail":"fixture@stardust.dev","userSlug":"fixture"}\n\n'
    const put = jest.fn(async (_url, { data }) => {
      const response = await registerMocks(
        new Request('http://web.test/api/tests/server', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      )
      return { ok: () => response.ok }
    })
    const page = { request: { put } } as unknown as Page
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/profile/events',
        rawBody,
        headers: { 'Content-Type': 'text/event-stream' },
      },
      { method: 'GET', path: '/profile/onboarding-attempt', body: { ready: false } },
    ])
    const response = await mockGET(
      new NextRequest('http://web.test/api/tests/server/profile/events'),
      { params: Promise.resolve({ path: ['profile', 'events'] }) },
    )
    expect(response.headers.get('content-type')).toBe('text/event-stream')
    expect(await response.text()).toBe(rawBody)
    const json = await mockGET(
      new NextRequest('http://web.test/api/tests/server/profile/onboarding-attempt'),
      { params: Promise.resolve({ path: ['profile', 'onboarding-attempt'] }) },
    )
    expect(await json.json()).toEqual({ ready: false })
  })
})
