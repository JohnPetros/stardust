import { isSafeNextRoute } from '../is-safe-next-route'

describe('isSafeNextRoute', () => {
  it('allows the password reset route as a post-login destination', () => {
    expect(isSafeNextRoute('/auth/reset-password')).toBe(true)
  })

  it('allows internal application routes', () => {
    expect(isSafeNextRoute('/space')).toBe(true)
  })

  it.each([
    '/auth',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/account-confirmation',
    '/auth/social-account-confirmation',
    'https://example.com',
    '//example.com/path',
    '/space\\\\redirect',
  ])('rejects unsafe destination %s', (nextRoute) => {
    expect(isSafeNextRoute(nextRoute)).toBe(false)
  })
})
