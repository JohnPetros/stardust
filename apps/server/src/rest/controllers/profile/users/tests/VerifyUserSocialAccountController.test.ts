import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { VerifyUserSocialAccountUseCase } from '@stardust/core/profile/use-cases'

import { VerifyUserSocialAccountController } from '../VerifyUserSocialAccountController'

describe('Verify User Social Account Controller', () => {
  type Schema = {
    body: {
      id: string
      name: string
      email: string
      provider: string
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: VerifyUserSocialAccountController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.setBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new VerifyUserSocialAccountController(usersRepository)
  })

  it('should verify social account and append deduplicated user name to body', async () => {
    const body = {
      id: 'google-user-id',
      name: 'petros',
      email: 'petros@stardust.dev',
      provider: 'google',
    }
    const deduplicatedUserName = 'petros-2'

    http.getBody.mockResolvedValue(body)
    const executeSpy = jest
      .spyOn(VerifyUserSocialAccountUseCase.prototype, 'execute')
      .mockResolvedValue({ deduplicatedUserName })

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      socialAccountId: body.id,
      socialAccountName: body.name,
    })
    expect(http.setBody).toHaveBeenCalledWith({
      ...body,
      name: deduplicatedUserName,
    })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })
})
