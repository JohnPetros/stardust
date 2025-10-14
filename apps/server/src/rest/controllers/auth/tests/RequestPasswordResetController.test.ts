import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Email } from '@stardust/core/global/structures'

import { RequestPasswordResetController } from '../RequestPasswordResetController'

describe('Request Password Reset Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new RequestPasswordResetController(service)
  })

  it('should call the auth service to request password reset', async () => {
    const restResponse = new RestResponse()
    const email = Email.create('test@test.com')
    service.requestPasswordReset.mockResolvedValue(restResponse)
    http.getBody.mockResolvedValue({ email: email.value })

    const response = await controller.handle(http)

    expect(service.requestPasswordReset).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
