import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

import { AppendIsSolutionUpvotedToBodyController } from '../AppendIsSolutionUpvotedToBodyController'

describe('Append Is Solution Upvoted To Body Controller', () => {
  type Schema = {
    routeParams: {
      solutionId: string
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: AppendIsSolutionUpvotedToBodyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendIsSolutionUpvotedToBodyController(usersRepository)
  })

  it('should append isSolutionUpvoted as true when solution is upvoted by user', async () => {
    const user = UsersFaker.fakeDto()
    const userId = user.id ?? IdFaker.fake().value
    const solutionId = IdFaker.fake().value

    http.getRouteParams.mockReturnValue({ solutionId })
    http.getAccountId.mockResolvedValue(userId)
    jest.spyOn(GetUserUseCase.prototype, 'execute').mockResolvedValue({
      ...user,
      upvotedSolutionsIds: [solutionId],
    })

    await controller.handle(http)

    expect(http.extendBody).toHaveBeenCalledWith({ isSolutionUpvoted: true })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should append isSolutionUpvoted as false when solution is not upvoted by user', async () => {
    const user = UsersFaker.fakeDto()
    const userId = user.id ?? IdFaker.fake().value
    const solutionId = IdFaker.fake().value

    http.getRouteParams.mockReturnValue({ solutionId })
    http.getAccountId.mockResolvedValue(userId)
    jest.spyOn(GetUserUseCase.prototype, 'execute').mockResolvedValue({
      ...user,
      upvotedSolutionsIds: [],
    })

    await controller.handle(http)

    expect(http.extendBody).toHaveBeenCalledWith({ isSolutionUpvoted: false })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })
})
