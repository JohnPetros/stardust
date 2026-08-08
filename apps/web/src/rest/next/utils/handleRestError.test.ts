import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'

import { handleRestError } from './handleRestError'
import { parseResponseJson } from './parseResponseJson'
import { getCookie, setCookie } from '@/rpc/next-safe-action/cookieActions'
import { AuthService } from '@/rest/services'

jest.mock('./parseResponseJson', () => ({
  parseResponseJson: jest.fn(),
}))

jest.mock('@/rpc/next-safe-action/cookieActions', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}))

jest.mock('@/rest/next/NextRestClient', () => ({
  NextRestClient: jest.fn(() => ({
    setBaseUrl: jest.fn(),
  })),
}))

jest.mock('@/rest/services', () => ({
  AuthService: jest.fn(),
}))

describe('handleRestError', () => {
  const mockParseResponseJson = jest.mocked(parseResponseJson)
  const mockGetCookie = jest.mocked(getCookie)
  const mockSetCookie = jest.mocked(setCookie)
  const mockAuthService = jest.mocked(AuthService)
  const refreshSession = jest.fn()

  beforeEach(() => {
    mockParseResponseJson.mockResolvedValue(null)
    mockGetCookie.mockReset()
    mockSetCookie.mockReset()
    refreshSession.mockReset()
    mockAuthService.mockReturnValue({
      refreshSession,
    } as never)
  })

  it('should refresh the session, update authorization and retry the failed request', async () => {
    const session = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      durationInSeconds: 3600,
    }
    const failedRequest = jest
      .fn()
      .mockResolvedValue(
        new RestResponse({ body: { success: true }, statusCode: HTTP_STATUS_CODE.ok }),
      )
    const onRefreshSuccess = jest.fn()

    mockGetCookie.mockResolvedValue({ data: 'refresh-token' })
    refreshSession.mockResolvedValue(
      new RestResponse({ body: session, statusCode: HTTP_STATUS_CODE.ok }),
    )

    await handleRestError(
      {
        status: HTTP_STATUS_CODE.unauthorized,
        url: 'https://api.stardust.dev/protected-resource',
      } as Response,
      failedRequest,
      onRefreshSuccess,
    )

    expect(onRefreshSuccess).toHaveBeenCalledWith(session)
    expect(failedRequest).toHaveBeenCalledTimes(1)
    expect(mockSetCookie).toHaveBeenCalledTimes(2)
  })

  it('should not try to refresh the refresh-session route itself', async () => {
    mockParseResponseJson.mockResolvedValue({
      title: 'Unauthorized',
      message: 'Invalid refresh token',
    })

    const result = await handleRestError(
      {
        status: HTTP_STATUS_CODE.unauthorized,
        url: 'https://api.stardust.dev/auth/refresh-session',
      } as Response,
      jest.fn(),
    )

    expect(mockGetCookie).not.toHaveBeenCalled()
    expect(result.isFailure).toBe(true)
    expect(result.errorMessage).toBe('Invalid refresh token')
  })

  it('should not retry when refresh fails', async () => {
    const failedRequest = jest.fn()

    mockGetCookie.mockResolvedValue({ data: 'refresh-token' })
    refreshSession.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.unauthorized }),
    )

    const result = await handleRestError(
      {
        status: HTTP_STATUS_CODE.unauthorized,
        url: 'https://api.stardust.dev/protected-resource',
      } as Response,
      failedRequest,
    )

    expect(failedRequest).not.toHaveBeenCalled()
    expect(mockSetCookie).not.toHaveBeenCalled()
    expect(result.statusCode).toBe(HTTP_STATUS_CODE.unauthorized)
  })

  it('should share a concurrent refresh between unauthorized requests', async () => {
    let resolveRefresh!: (response: RestResponse<SessionDto>) => void
    refreshSession.mockReturnValue(
      new Promise<RestResponse<SessionDto>>((resolve) => {
        resolveRefresh = resolve
      }),
    )
    mockGetCookie.mockResolvedValue({ data: 'refresh-token' })

    const session = {
      account: {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'test@stardust.dev',
        name: 'Test User',
        isAuthenticated: true,
      },
      accessToken: 'shared-access-token',
      refreshToken: 'shared-refresh-token',
      durationInSeconds: 3600,
    }
    const firstRequest = jest.fn().mockResolvedValue(new RestResponse({ body: 1 }))
    const secondRequest = jest.fn().mockResolvedValue(new RestResponse({ body: 2 }))

    const first = handleRestError(
      {
        status: HTTP_STATUS_CODE.unauthorized,
        url: 'https://api.stardust.dev/first',
      } as Response,
      firstRequest,
    )
    const second = handleRestError(
      {
        status: HTTP_STATUS_CODE.unauthorized,
        url: 'https://api.stardust.dev/second',
      } as Response,
      secondRequest,
    )

    await Promise.resolve()
    expect(refreshSession).toHaveBeenCalledTimes(1)

    resolveRefresh(new RestResponse({ body: session, statusCode: HTTP_STATUS_CODE.ok }))
    await Promise.all([first, second])

    expect(firstRequest).toHaveBeenCalledTimes(1)
    expect(secondRequest).toHaveBeenCalledTimes(1)
    expect(mockSetCookie).toHaveBeenCalledTimes(2)
  })
})
