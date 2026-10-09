/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET } from '../route'

jest.mock('@/constants', () => ({
  CLIENT_ENV: { stardustServerUrl: 'http://upstream.test' },
  COOKIES: {
    onboardingAttempt: { key: '@stardust:onboarding-attempt', durationInSeconds: 900 },
  },
}))
const fetchMock = jest.fn()
function request(cookie?: string) {
  return new NextRequest(
    'http://web.test/api/auth/onboarding-attempt?accountId=untrusted',
    { headers: cookie ? { Cookie: cookie } : {} },
  )
}

describe('GET /api/auth/onboarding-attempt', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock
  })

  it('returns null and removes an absent attempt without calling upstream', async () => {
    const response = await GET(request())
    expect(response.status).toBe(200)
    expect(await response.json()).toBeNull()
    expect(response.cookies.get('@stardust:onboarding-attempt')?.maxAge).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forwards only the receipt, preserves attempt and never refreshes its cookie', async () => {
    const attempt = {
      account: { id: 'account', name: 'Cadastro Estelar', email: 'signup@stardust.dev' },
      expiresAt: '2026-10-01T12:00:00.000Z',
      isUserCreated: false,
    }
    fetchMock.mockResolvedValueOnce(Response.json(attempt))
    const incoming = request(
      '@stardust:onboarding-attempt=fixture; @stardust:access-token=forbidden; unrelated=forbidden',
    )
    const response = await GET(incoming)
    expect(await response.json()).toEqual(attempt)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://upstream.test/profile/onboarding-attempt',
      expect.objectContaining({
        headers: { 'X-Onboarding-Receipt': 'fixture' },
        cache: 'no-store',
        signal: incoming.signal,
      }),
    )
    expect(response.headers.has('set-cookie')).toBe(false)
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('translates only unauthorized receipt into null and removes it at the same path', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ title: 'Unauthorized' }, { status: 401 }),
    )
    const response = await GET(request('@stardust:onboarding-attempt=invalid-fixture'))
    expect(response.status).toBe(200)
    expect(await response.json()).toBeNull()
    expect(response.cookies.get('@stardust:onboarding-attempt')).toEqual(
      expect.objectContaining({ path: '/api/auth', httpOnly: true, maxAge: 0 }),
    )
  })

  it('preserves upstream infrastructure failure instead of reporting absent/success', async () => {
    const body = { title: 'Database unavailable' }
    fetchMock.mockResolvedValueOnce(Response.json(body, { status: 503 }))
    const response = await GET(request('@stardust:onboarding-attempt=fixture'))
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual(body)
    expect(response.headers.has('set-cookie')).toBe(false)
  })

  it('maps fetch failure to an infrastructure error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'))
    const response = await GET(request('@stardust:onboarding-attempt=fixture'))
    expect(response.status).toBe(502)
    expect(await response.json()).not.toBeNull()
  })
})
