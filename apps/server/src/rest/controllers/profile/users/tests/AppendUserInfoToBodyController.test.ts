import { mock, type Mock } from 'ts-jest-mocker'

import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { Http } from '@stardust/core/global/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

import { AppendUserInfoToBodyController } from '../AppendUserInfoToBodyController'

describe('Append User Info To Body Controller', () => {
  let http: Mock<Http>
  let usersRepository: Mock<UsersRepository>
  let controller: AppendUserInfoToBodyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendUserInfoToBodyController(usersRepository)
  })

  it('should get account id, fetch user and append user info to body', async () => {
    const user = UsersFaker.fakeDto()
    const userId = user.id ?? IdFaker.fake().value

    http.getAccountId.mockResolvedValue(userId)
    const executeSpy = jest
      .spyOn(GetUserUseCase.prototype, 'execute')
      .mockResolvedValue(user)

    await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ userId })
    expect(http.extendBody).toHaveBeenCalledWith({
      userName: user.name,
      userSlug: user.slug,
      userAvatar: user.avatar,
    })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })
})
