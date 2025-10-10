import { mock, type Mock } from 'ts-jest-mocker'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Text } from '@stardust/core/global/structures'
import { SignInWithGithubAccountController } from '../SignInWithGithubAccountController'

describe('Sign In With Github Account Controller', () => {
  let http: Mock<Http>
  let service: Mock<AuthService>
  let controller: Controller

  beforeEach(() => {
    http = mock()
    service = mock<AuthService>()
    http.redirect.mockImplementation()
    controller = new SignInWithGithubAccountController(service)
  })

  it('should call the auth service with the correct return url and redirect to the sign in url', async () => {
    const returnUrl = Text.create('test-return-url')
    const restResponse = new RestResponse({ body: { signInUrl: 'test-sign-in-url' } })
    http.getQueryParams.mockReturnValue({ returnUrl: returnUrl.value })
    service.signInWithGithubAccount.mockResolvedValue(restResponse)

    await controller.handle(http)

    expect(service.signInWithGithubAccount).toHaveBeenCalledWith(returnUrl)
    expect(http.redirect).toHaveBeenCalledWith(restResponse.body.signInUrl)
  })

  it('should return a failure if the auth service returns a failure', async () => {
    const returnUrl = Text.create('test-return-url')
    http.getQueryParams.mockReturnValue({ returnUrl: returnUrl.value })
    const restResponse = new RestResponse({
      statusCode: 500,
      body: { signInUrl: 'test-sign-in-url' },
    })
    service.signInWithGithubAccount.mockResolvedValue(restResponse)

    const response = await controller.handle(http)

    expect(response).toEqual(restResponse)
  })
})
