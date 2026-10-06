/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST, dynamic, runtime } from '../route'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { CLIENT_ENV } from '@/constants'

jest.mock('@/rpc/next-safe-action/cookieActions', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}))

jest.mock('@/constants', () => ({
  CLIENT_ENV: {
    stardustServerUrl: 'http://upstream.test',
    stardustWebUrl: 'http://web.test',
  },
  COOKIES: {
    onboardingAttempt: { key: '@stardust:onboarding-attempt', durationInSeconds: 900 },
  },
}))

const fields = {
  email: 'signup@stardust.dev',
  password: '123456',
  name: 'Cadastro Estelar',
}
const fetchMock = jest.fn()

function request(body: unknown = fields, origin: string | null = 'http://web.test') {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Cookie: '@stardust:onboarding-attempt=old-attempt',
  })
  if (origin !== null) headers.set('Origin', origin)
  return new NextRequest('http://web.test/api/auth/sign-up', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/sign-up', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock
  })

  it.each([null, 'http://other.test'])(
    'rejects untrusted Origin %s before forwarding and clears previous attempt',
    async (origin) => {
      const response = await POST(request(fields, origin))
      expect(response.status).toBe(403)
      expect(fetchMock).not.toHaveBeenCalled()
      expect(response.cookies.get('@stardust:onboarding-attempt')?.value).toBe('')
      expect(response.headers.get('set-cookie')).toContain('Max-Age=0')
    },
  )

  it('accepts the configured loopback Origin despite NextURL normalizing its host', async () => {
    const previousWebUrl = CLIENT_ENV.stardustWebUrl
    CLIENT_ENV.stardustWebUrl = 'http://127.0.0.1:3100'
    try {
      fetchMock.mockResolvedValueOnce(Response.json({ id: 'account' }, { status: 201 }))
      const incoming = new NextRequest('http://127.0.0.1:3100/api/auth/sign-up', {
        method: 'POST',
        headers: { Origin: 'http://127.0.0.1:3100', 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      expect(incoming.nextUrl.origin).toBe('http://localhost:3100')
      const response = await POST(incoming)
      expect(response.status).toBe(201)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    } finally {
      CLIENT_ENV.stardustWebUrl = previousWebUrl
    }
  })

  it('uses existing validation schemas and clears the cookie on invalid input', async () => {
    const response = await POST(request({ ...fields, email: 'invalid' }))
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual(
      expect.objectContaining({ fieldErrors: expect.any(Array) }),
    )
    expect(response.cookies.get('@stardust:onboarding-attempt')?.value).toBe('')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('preserves upstream status/body, limits the HttpOnly cookie, and hides internal headers', async () => {
    const body = { id: 'signed-account', email: fields.email, name: fields.name }
    const expiresAt = new Date(Date.now() + 1800000).toISOString()
    fetchMock.mockResolvedValueOnce(
      Response.json(body, {
        status: 201,
        headers: {
          'X-Onboarding-Receipt': 'fixture-receipt',
          'X-Onboarding-Expires-At': expiresAt,
          'X-Onboarding-SignUp-Eligible': 'true',
          'Access-Control-Expose-Headers': 'X-Onboarding-Receipt',
          'Set-Cookie': 'upstream-session=forbidden',
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
      }),
    )
    const incoming = request()
    const response = await POST(incoming)
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(body)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://upstream.test/auth/sign-up',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(fields),
        cache: 'no-store',
        signal: incoming.signal,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const cookie = response.cookies.get('@stardust:onboarding-attempt')
    expect(cookie).toEqual(
      expect.objectContaining({
        value: 'fixture-receipt',
        httpOnly: true,
        sameSite: 'lax',
        path: '/api/auth',
      }),
    )
    expect(cookie?.maxAge).toBeLessThanOrEqual(900)
    expect(cookie?.maxAge).toBeGreaterThan(0)
    expect(new Date(cookie?.expires ?? 0).getTime()).toBeLessThanOrEqual(
      Date.now() + 900000,
    )
    expect(cookie?.domain).toBeUndefined()
    for (const header of [
      'x-onboarding-receipt',
      'x-onboarding-expires-at',
      'x-onboarding-signup-eligible',
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
    ])
      expect(response.headers.has(header)).toBe(false)
    expect(response.headers.get('set-cookie')).not.toContain('upstream-session')
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('retry-after')).toBe('1')
  })

  it('does not extend a short signed expiry', async () => {
    const expiry = new Date(Date.now() + 60000)
    fetchMock.mockResolvedValueOnce(
      Response.json(null, {
        headers: {
          'X-Onboarding-Receipt': 'fixture',
          'X-Onboarding-Expires-At': expiry.toISOString(),
        },
      }),
    )
    const response = await POST(request())
    const cookie = response.cookies.get('@stardust:onboarding-attempt')
    expect(cookie?.maxAge).toBeLessThanOrEqual(60)
    expect(new Date(cookie?.expires ?? 0).getTime()).toBeLessThanOrEqual(expiry.getTime())
  })

  it('sets Secure in production', async () => {
    const environment = jest.replaceProperty(process.env, 'NODE_ENV', 'production')
    try {
      fetchMock.mockResolvedValueOnce(
        Response.json(null, {
          headers: {
            'X-Onboarding-Receipt': 'fixture',
            'X-Onboarding-Expires-At': new Date(Date.now() + 60000).toISOString(),
          },
        }),
      )
      expect(
        (await POST(request())).cookies.get('@stardust:onboarding-attempt')?.secure,
      ).toBe(true)
    } finally {
      environment.restore()
    }
  })

  it.each<Record<string, string>>([
    {},
    {
      'X-Onboarding-Receipt': 'fixture',
      'X-Onboarding-Expires-At': new Date(0).toISOString(),
    },
    { 'X-Onboarding-Receipt': 'fixture', 'X-Onboarding-Expires-At': 'invalid' },
  ])(
    'clears stale attempts on ineligible success or unusable expiry',
    async (headers) => {
      fetchMock.mockResolvedValueOnce(Response.json(null, { headers }))
      const response = await POST(request())
      expect(response.status).toBe(200)
      expect(response.cookies.get('@stardust:onboarding-attempt')?.value).toBe('')
    },
  )

  it('preserves failure body/status and clears any prior receipt', async () => {
    const body = { title: 'Conflict', message: 'Cadastro indisponível' }
    fetchMock.mockResolvedValueOnce(Response.json(body, { status: 409 }))
    const response = await POST(request())
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual(body)
    expect(response.cookies.get('@stardust:onboarding-attempt')?.value).toBe('')
  })

  it('maps infrastructure failure without retaining the previous attempt', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'))
    const response = await POST(request())
    expect(response.status).toBe(502)
    expect(response.cookies.get('@stardust:onboarding-attempt')?.value).toBe('')
  })

  it('preserves lowercase POST response headers for server-side transport consumers', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json(
        { id: 'account' },
        {
          status: 201,
          headers: {
            'X-Onboarding-Receipt': 'fixture',
            'X-Onboarding-Expires-At': 'expiry',
          },
        },
      ),
    )
    const client = NextRestClient({ isCacheEnabled: false })
    client.setBaseUrl('http://upstream.test')
    const response = await client.post('/auth/sign-up', fields)
    expect(response.headers['x-onboarding-receipt']).toBe('fixture')
    expect(response.headers['x-onboarding-expires-at']).toBe('expiry')
    expect(runtime).toBe('nodejs')
    expect(dynamic).toBe('force-dynamic')
  })
})
