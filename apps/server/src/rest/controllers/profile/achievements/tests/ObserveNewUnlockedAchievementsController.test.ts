import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type {
  AchievementsRepository,
  UsersRepository,
} from '@stardust/core/profile/interfaces'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import { ObserveNewUnlockedAchievementsUseCase } from '@stardust/core/profile/use-cases'

import { ObserveNewUnlockedAchievementsController } from '../ObserveNewUnlockedAchievementsController'

describe('Observe New Unlocked Achievements Controller', () => {
  let http: Mock<Http<{ routeParams: { userId: string } }>>
  let achievementsRepository: Mock<AchievementsRepository>
  let usersRepository: Mock<UsersRepository>
  let controller: ObserveNewUnlockedAchievementsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    achievementsRepository = mock()
    usersRepository = mock()
    controller = new ObserveNewUnlockedAchievementsController(
      achievementsRepository,
      usersRepository,
    )
  })

  it('should extract route params, execute use case with userId and return response through http.send', async () => {
    const userId = 'b53f7acf-b67f-4d80-90c7-0f8e1a6ee2ba'
    const useCaseResponse = [AchievementsFaker.fakeDto()]
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ userId })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ObserveNewUnlockedAchievementsUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ userId })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
