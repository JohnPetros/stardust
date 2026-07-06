import { mock, type Mock } from 'ts-jest-mocker'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { FetchSocialAccountController } from '../FetchSocialAccountController'

describe('FetchSocialAccountController', () => {
  let controller: FetchSocialAccountController
  let authService: Mock<AuthService>
  let http: Mock<Http>

  beforeEach(() => {
    authService = mock<AuthService>()
    http = mock<Http>()
    controller = new FetchSocialAccountController(authService)
  })

  it('should delegate to auth service', async () => {
    const response = new RestResponse<AccountDto>({
      body: {
        email: 'account@example.com',
        name: 'Account',
        isAuthenticated: true,
      },
    })
    authService.fetchSocialAccount.mockResolvedValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)

    expect(authService.fetchSocialAccount).toHaveBeenCalled()
  })
})
