import { cookies } from 'next/headers'
import { updateTag } from 'next/dist/server/web/spec-extension/revalidate'

import { NextCall } from '../NextCall'

jest.mock('next/dist/server/web/spec-extension/revalidate', () => ({
  updateTag: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

describe('NextCall', () => {
  it('should invalidate cache tags immediately', () => {
    const call = NextCall()

    call.resetCache('account-connection')

    expect(updateTag).toHaveBeenCalledWith('account-connection')
  })

  it('should proxy cookie access through next headers', async () => {
    const cookieStore = {
      set: jest.fn(),
      get: jest.fn().mockReturnValue({ value: 'value' }),
      has: jest.fn().mockReturnValue(true),
      delete: jest.fn(),
    }

    ;(cookies as jest.Mock).mockResolvedValue(cookieStore)

    const call = NextCall()

    await call.setCookie('token', 'value', 60)
    await expect(call.getCookie('token')).resolves.toBe('value')
    await expect(call.hasCookie('token')).resolves.toBe(true)
    await call.deleteCookie('token')

    expect(cookieStore.set).toHaveBeenCalled()
    expect(cookieStore.delete).toHaveBeenCalledWith('token')
  })
})
