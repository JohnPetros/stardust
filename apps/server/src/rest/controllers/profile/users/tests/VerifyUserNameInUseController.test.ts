import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserNameInUseUseCase } from '@stardust/core/profile/use-cases'

import { VerifyUserNameInUseController } from '../VerifyUserNameInUseController'

describe('Verify User Name In Use Controller', () => {
  let http: Mock<Http<{ queryParams: { name: string } }>>
  let usersRepository: Mock<UsersRepository>
  let controller: VerifyUserNameInUseController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.send.mockImplementation()
    controller = new VerifyUserNameInUseController(usersRepository)
  })

  it('should get query params, call use case and send response', async () => {
    const name = 'john-doe'
    const executeSpy = jest
      .spyOn(VerifyUserNameInUseUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    http.getQueryParams.mockReturnValue({ name })

    await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith(name)
    expect(http.send).toHaveBeenCalledTimes(1)
  })
})
