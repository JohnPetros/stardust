import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'

import { ResetPasswordController } from '../ResetPasswordController'

describe('Reset Password Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new ResetPasswordController(service)
  })

  it('should call the auth service to reset password', async () => {
    const restResponse = new RestResponse()
    const newPassword = Password.create('test@test.com')
    const accessToken = Text.create('test-access-token-token')
    const refreshToken = Text.create('test-refresh-token')
    service.resetPassword.mockResolvedValue(restResponse)
    http.getBody.mockResolvedValue({
      newPassword: newPassword.value,
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    })

    const response = await controller.handle(http)

    expect(service.resetPassword).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
