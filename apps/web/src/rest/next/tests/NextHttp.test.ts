import type { NextRequest } from 'next/server'

import { COOKIES } from '@/constants'
import * as cookieActions from '@/rpc/next-safe-action/cookieActions'
import { NextHttp } from '../NextHttp'

jest.mock('@/rpc/next-safe-action/cookieActions', () => ({
  getCookie: jest.fn(),
  hasCookie: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
    redirect: jest.fn(),
  },
}))

describe('NextHttp', () => {
  it('reads cookies from the current request in middleware', async () => {
    const request = {
      cookies: {
        get: (key: string) =>
          key === COOKIES.keys.rewardingPayload ? { value: 'payload' } : undefined,
        has: (key: string) => key === COOKIES.keys.rewardingPayload,
      },
    } as unknown as NextRequest
    const http = await NextHttp({ request })

    await expect(http.hasCookie(COOKIES.keys.rewardingPayload)).resolves.toBe(true)
    await expect(http.getCookie(COOKIES.keys.rewardingPayload)).resolves.toBe('payload')
    expect(cookieActions.hasCookie).not.toHaveBeenCalled()
    expect(cookieActions.getCookie).not.toHaveBeenCalled()
  })
})
