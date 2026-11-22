import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UserNotFoundError } from '@stardust/core/profile/errors'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { AppendUserTrailFactsToBodyController } from '../AppendUserTrailFactsToBodyController'

describe('Append User Trail Facts To Body Controller', () => {
  let http: Mock<Http>
  let usersRepository: Mock<UsersRepository>
  let controller: AppendUserTrailFactsToBodyController

  beforeEach(() => {
    http = mock()
    usersRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendUserTrailFactsToBodyController(usersRepository)
  })

  it('should extend the body with the facts of the session account', async () => {
    const accountId = IdFaker.fake().value
    const completedStarsIds = [IdFaker.fake().value, IdFaker.fake().value]
    const openedPlanetsIds = [IdFaker.fake().value]
    http.getAccountId.mockResolvedValue(accountId)
    usersRepository.findById.mockResolvedValue(
      UsersFaker.fake({ id: accountId, completedStarsIds, openedPlanetsIds }),
    )

    await controller.handle(http)

    expect(http.extendBody).toHaveBeenCalledWith({ completedStarsIds, openedPlanetsIds })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should throw when the session account has no user', async () => {
    http.getAccountId.mockResolvedValue(IdFaker.fake().value)
    usersRepository.findById.mockResolvedValue(null)

    await expect(controller.handle(http)).rejects.toThrow(UserNotFoundError)
    expect(http.extendBody).not.toHaveBeenCalled()
  })
})
