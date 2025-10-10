import { type Mock, mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { ResendSignUpEmailController } from '../ResendSignUpEmailController'
import { Email } from '@stardust/core/global/structures'

describe('Resend Sign Up Email Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new ResendSignUpEmailController(service)
  })

  it('should call the auth service to resend sign up email', async () => {
    const restResponse = new RestResponse()
    const email = Email.create('test@test.com')
    service.resendSignUpEmail.mockResolvedValue(restResponse)
    http.getBody.mockResolvedValue({ email: email.value })

    const response = await controller.handle(http)

    expect(service.resendSignUpEmail).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
