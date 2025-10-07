import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { SessionFaker } from '@stardust/core/auth/structures/fakers'
import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import { Text } from '@stardust/core/global/structures'

import { COOKIES, ROUTES } from '@/constants'
import { cookieActions } from '@/rpc/next-safe-action'
import { VerifyAuthRoutesController } from '../VerifyAuthRoutesController'

// Mock the cookieActions module
jest.mock('@/rpc/next-safe-action', () => ({
  cookieActions: {
    getCookie: jest.fn(),
  },
}))

describe('Verify Auth Routes Controller', () => {
  let http: Mock<Http>
  let authService: Mock<AuthService>
  let controller: Controller
  let mockCookieActions: jest.Mocked<typeof cookieActions>
  const session = SessionFaker.fakeDto()
  const account = AccountsFaker.fakeDto()

  beforeEach(() => {
    http = mock()
    authService = mock<AuthService>()
    mockCookieActions = cookieActions as jest.Mocked<typeof cookieActions>

    http.getCurrentRoute.mockImplementation()
    http.redirect.mockImplementation()
    http.setCookie.mockImplementation()
    http.pass.mockImplementation()
    authService.fetchAccount.mockImplementation()
    authService.refreshSession.mockImplementation()
    mockCookieActions.getCookie.mockImplementation()

    controller = VerifyAuthRoutesController(authService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Public Routes', () => {
    it('should allow access to public routes without authentication', async () => {
      http.getCurrentRoute.mockReturnValue(ROUTES.auth.signIn)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )

      await controller.handle(http)

      expect(http.pass).toHaveBeenCalled()
      expect(http.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to snippet pages without authentication', async () => {
      const snippetRoute = `${ROUTES.playground.snippets}/some-snippet-id`
      http.getCurrentRoute.mockReturnValue(snippetRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )

      await controller.handle(http)

      expect(http.pass).toHaveBeenCalled()
      expect(http.redirect).not.toHaveBeenCalled()
    })
  })

  describe('Private Routes', () => {
    it('should redirect to sign in page when accessing private route without authentication', async () => {
      const privateRoute = '/some-private-route'
      http.getCurrentRoute.mockReturnValue(privateRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )
      mockCookieActions.getCookie.mockResolvedValue({ data: null })

      await controller.handle(http)

      expect(http.redirect).toHaveBeenCalledWith(ROUTES.auth.signIn)
    })
  })

  describe('Session Refresh', () => {
    it('should attempt to refresh session when no active session and refresh token exists', async () => {
      const privateRoute = '/some-private-route'
      const refreshToken = 'valid-refresh-token'

      http.getCurrentRoute.mockReturnValue(privateRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )
      mockCookieActions.getCookie.mockResolvedValue({ data: refreshToken })
      authService.refreshSession.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: session }),
      )

      await controller.handle(http)

      expect(authService.refreshSession).toHaveBeenCalledWith(Text.create(refreshToken))
    })

    it('should set new cookies when session refresh is successful', async () => {
      const privateRoute = '/some-private-route'
      const refreshToken = 'valid-refresh-token'

      http.getCurrentRoute.mockReturnValue(privateRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )
      mockCookieActions.getCookie.mockResolvedValue({ data: refreshToken })
      authService.refreshSession.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: session }),
      )

      await controller.handle(http)

      expect(http.setCookie).toHaveBeenCalledTimes(2)
      expect(http.setCookie).toHaveBeenNthCalledWith(
        1,
        COOKIES.accessToken.key,
        session.accessToken,
        session.durationInSeconds,
      )
      expect(http.setCookie).toHaveBeenNthCalledWith(
        2,
        COOKIES.refreshToken.key,
        session.refreshToken,
        session.durationInSeconds,
      )
    })

    it('should redirect to current route when session refresh is successful', async () => {
      const privateRoute = '/some-private-route'
      const refreshToken = 'valid-refresh-token'

      http.getCurrentRoute.mockReturnValue(privateRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )
      mockCookieActions.getCookie.mockResolvedValue({ data: refreshToken })
      authService.refreshSession.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: session }),
      )

      await controller.handle(http)

      expect(http.redirect).toHaveBeenCalledWith(privateRoute)
    })

    it('should redirect to sign in when session refresh fails', async () => {
      const privateRoute = '/some-private-route'
      const refreshToken = 'invalid-refresh-token'

      http.getCurrentRoute.mockReturnValue(privateRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )
      mockCookieActions.getCookie.mockResolvedValue({ data: refreshToken })
      authService.refreshSession.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )

      await controller.handle(http)

      expect(http.redirect).toHaveBeenCalledWith(ROUTES.auth.signIn)
    })

    it('should not attempt refresh when no refresh token is available', async () => {
      const privateRoute = '/some-private-route'

      http.getCurrentRoute.mockReturnValue(privateRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )
      mockCookieActions.getCookie.mockResolvedValue({ data: null })

      await controller.handle(http)

      expect(authService.refreshSession).not.toHaveBeenCalled()
      expect(http.redirect).toHaveBeenCalledWith(ROUTES.auth.signIn)
    })
  })

  describe('Authenticated User Redirects', () => {
    it('should redirect authenticated user from root route to space', async () => {
      http.getCurrentRoute.mockReturnValue(ROUTES.landing)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: account }),
      )

      await controller.handle(http)

      expect(http.redirect).toHaveBeenCalledWith(ROUTES.space)
    })

    it('should redirect authenticated user from sign in route to space', async () => {
      http.getCurrentRoute.mockReturnValue(ROUTES.auth.signIn)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: account }),
      )

      await controller.handle(http)

      expect(http.redirect).toHaveBeenCalledWith(ROUTES.space)
    })
  })

  describe('Normal Flow', () => {
    it('should pass through when authenticated user accesses allowed route', async () => {
      const allowedRoute = '/some-allowed-route'
      http.getCurrentRoute.mockReturnValue(allowedRoute)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: account }),
      )

      await controller.handle(http)

      expect(http.pass).toHaveBeenCalled()
      expect(http.redirect).not.toHaveBeenCalled()
    })

    it('should pass through when unauthenticated user accesses public auth route', async () => {
      http.getCurrentRoute.mockReturnValue(ROUTES.auth.signUp)
      authService.fetchAccount.mockResolvedValue(
        new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
      )

      await controller.handle(http)

      expect(http.pass).toHaveBeenCalled()
      expect(http.redirect).not.toHaveBeenCalled()
    })
  })
})
