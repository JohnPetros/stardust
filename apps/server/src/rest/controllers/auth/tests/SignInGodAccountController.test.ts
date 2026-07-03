import { mock, type Mock } from 'ts-jest-mocker'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import { NotGodAccountError } from '@stardust/core/global/errors'
import type { Http } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { ENV } from '@/constants'

import { SignInGodAccountController } from '../SignInGodAccountController'

describe('SignInGodAccountController', () => {
  type Schema = {
    body: {
      email: string
      password: string
    }
  }

  const originalGodAccountIds = ENV.godAccountIds

  let controller: SignInGodAccountController
  let authService: Mock<AuthService>
  let http: Mock<Http<Schema>>

  beforeEach(() => {
    authService = mock<AuthService>()
    http = mock<Http<Schema>>()
    controller = new SignInGodAccountController(authService)
    ENV.godAccountIds = ['god-account-id']
  })

  afterAll(() => {
    ENV.godAccountIds = originalGodAccountIds
  })

  it('should sign in a god account', async () => {
    http.getBody.mockResolvedValue({
      email: 'god@stardust.dev',
      password: 'secret-123',
    })
    const response = new RestResponse<SessionDto>({
      body: {
        account: { id: 'god-account-id' } as SessionDto['account'],
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        durationInSeconds: 3600,
      },
    })
    authService.signIn.mockResolvedValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)
    expect(authService.signIn).toHaveBeenCalled()
  })

  it('should throw when the authenticated account is not a god account', async () => {
    http.getBody.mockResolvedValue({
      email: 'user@stardust.dev',
      password: 'secret-123',
    })
    authService.signIn.mockResolvedValue(
      new RestResponse<SessionDto>({
        body: {
          account: { id: 'regular-account-id' } as SessionDto['account'],
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          durationInSeconds: 3600,
        },
      }),
    )

    await expect(controller.handle(http)).rejects.toThrow(NotGodAccountError)
  })
})
