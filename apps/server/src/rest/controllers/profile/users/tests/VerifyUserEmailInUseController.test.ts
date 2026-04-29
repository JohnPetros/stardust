import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserEmailInUseUseCase } from '@stardust/core/profile/use-cases'

import { VerifyUserEmailInUseController } from '../VerifyUserEmailInUseController'

describe('Verify User Email In Use Controller', () => {
  let http: Mock<Http<{ queryParams: { email: string } }>>
  let usersRepository: Mock<UsersRepository>
  let controller: VerifyUserEmailInUseController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    controller = new VerifyUserEmailInUseController(usersRepository)
  })

  it('should get query params, call use case and send response', async () => {
    const email = 'john@stardust.dev'
    const executeSpy = jest
      .spyOn(VerifyUserEmailInUseUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    http.getQueryParams.mockReturnValue({ email })

    await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith(email)
    expect(http.send).toHaveBeenCalledTimes(1)
  })
})
