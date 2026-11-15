import { mock, type Mock } from 'ts-jest-mocker'

import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { Http } from '@stardust/core/global/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

import { AppendUserCurrentGalaxyToBodyController } from '../AppendUserCurrentGalaxyToBodyController'

describe('Append User Current Galaxy To Body Controller', () => {
  let http: Mock<Http>
  let usersRepository: Mock<UsersRepository>
  let controller: AppendUserCurrentGalaxyToBodyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendUserCurrentGalaxyToBodyController(usersRepository)
  })

  it('should read the session account and append the stored galaxy id to the body', async () => {
    const userId = IdFaker.fake().value
    const storedGalaxyId = IdFaker.fake().value
    const user = UsersFaker.fakeDto({ currentGalaxy: { id: storedGalaxyId } })

    http.getAccountId.mockResolvedValue(userId)
    const executeSpy = jest
      .spyOn(GetUserUseCase.prototype, 'execute')
      .mockResolvedValue(user)

    await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ userId })
    expect(http.extendBody).toHaveBeenCalledWith({ storedGalaxyId })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should append null when the user has no current galaxy', async () => {
    const user = UsersFaker.fakeDto({ currentGalaxy: null })

    http.getAccountId.mockResolvedValue(IdFaker.fake().value)
    jest.spyOn(GetUserUseCase.prototype, 'execute').mockResolvedValue(user)

    await controller.handle(http)

    expect(http.extendBody).toHaveBeenCalledWith({ storedGalaxyId: null })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should propagate use case errors without extending the body or passing', async () => {
    const error = new Error('User not found')

    http.getAccountId.mockResolvedValue(IdFaker.fake().value)
    jest.spyOn(GetUserUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.extendBody).not.toHaveBeenCalled()
    expect(http.pass).not.toHaveBeenCalled()
  })
})
