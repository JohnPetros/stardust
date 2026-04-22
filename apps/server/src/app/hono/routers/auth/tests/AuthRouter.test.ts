import { AuthRouter } from '../AuthRouter'

describe('Auth Router (/auth)', () => {
  test('should register routes without booting the full app', () => {
    const router = new AuthRouter({} as never)

    expect(router.registerRoutes()).toBeDefined()
  })
})
