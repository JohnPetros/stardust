import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { SignOutController } from '../SignOutController'

describe('Sign Out Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    controller = new SignOutController(service)
  })

  it('should call the auth service to sign out', async () => {
    const restResponse = new RestResponse()
    service.signOut.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(service.signOut).toHaveBeenCalled()
    expect(response).toEqual(restResponse)
  })
})
