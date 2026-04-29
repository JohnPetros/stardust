import { mock, type Mock } from 'ts-jest-mocker'

import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { AppendUserCompletedChallengesIdsToBodyController } from '../AppendUserCompletedChallengesIdsToBodyController'

describe('Append User Completed Challenges Ids To Body Controller', () => {
  let http: Mock<Http>
  let usersRepository: Mock<UsersRepository>
  let controller: AppendUserCompletedChallengesIdsToBodyController

  beforeEach(() => {
    http = mock()
    usersRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendUserCompletedChallengesIdsToBodyController(usersRepository)
  })

  it('should pass without appending when account does not exist', async () => {
    http.getAccount.mockResolvedValue(null as never)

    await controller.handle(http)

    expect(usersRepository.findById).not.toHaveBeenCalled()
    expect(http.extendBody).not.toHaveBeenCalled()
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should pass without appending when user does not exist', async () => {
    const accountId = IdFaker.fake().value

    http.getAccount.mockResolvedValue(AccountsFaker.fakeDto({ id: accountId }))
    usersRepository.findById.mockResolvedValue(null)

    await controller.handle(http)

    expect(usersRepository.findById).toHaveBeenCalledTimes(1)
    expect(http.extendBody).not.toHaveBeenCalled()
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should append completed challenges ids when account and user exist', async () => {
    const accountId = IdFaker.fake().value
    const completedChallengesIds = [IdFaker.fake().value, IdFaker.fake().value]
    const user = UsersFaker.fake({
      id: accountId,
      completedChallengesIds,
    })

    http.getAccount.mockResolvedValue(AccountsFaker.fakeDto({ id: accountId }))
    usersRepository.findById.mockResolvedValue(user)

    await controller.handle(http)

    expect(http.extendBody).toHaveBeenCalledWith({
      userCompletedChallengesIds: completedChallengesIds,
    })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })
})
