import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type {
  AchievementsRepository,
  UsersRepository,
} from '@stardust/core/profile/interfaces'
import { RescueAchievementUseCase } from '@stardust/core/profile/use-cases'

import { RescueAchievementController } from '../RescueAchievementController'

describe('Rescue Achievement Controller', () => {
  let http: Mock<
    Http<{
      routeParams: {
        userId: string
        achievementId: string
      }
    }>
  >
  let achievementsRepository: Mock<AchievementsRepository>
  let usersRepository: Mock<UsersRepository>
  let controller: RescueAchievementController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    achievementsRepository = mock()
    usersRepository = mock()
    controller = new RescueAchievementController(achievementsRepository, usersRepository)
  })

  it('should extract userId and achievementId, execute use case and return response by http.send', async () => {
    const userId = IdFaker.fake().value
    const achievementId = IdFaker.fake().value
    const useCaseResponse = UsersFaker.fakeDto({ id: userId })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ userId, achievementId })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(RescueAchievementUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ userId, achievementId })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
