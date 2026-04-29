import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { Id } from '@stardust/core/global/structures'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'

import { FetchAllUnlockedAchievementsController } from '../FetchAllUnlockedAchievementsController'

describe('Fetch All Unlocked Achievements Controller', () => {
  let http: Mock<Http<{ routeParams: { userId: string } }>>
  let repository: Mock<AchievementsRepository>
  let controller: FetchAllUnlockedAchievementsController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new FetchAllUnlockedAchievementsController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract userId, convert with Id.create, call repository and send mapped dto list', async () => {
    const userId = '7a4f4df7-54f8-4c9d-b0b8-b35d8a4f3d30'
    const achievements = AchievementsFaker.fakeMany(3)
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ userId })
    repository.findAllUnlockedByUser.mockResolvedValue(achievements)
    http.send.mockReturnValue(restResponse)

    const createIdSpy = jest.spyOn(Id, 'create')

    const response = await controller.handle(http)
    const createdId = createIdSpy.mock.results[0]?.value

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(createIdSpy).toHaveBeenCalledWith(userId)
    expect(repository.findAllUnlockedByUser).toHaveBeenCalledWith(createdId)
    expect(http.send).toHaveBeenCalledWith(
      achievements.map((achievement) => achievement.dto),
    )
    expect(response).toBe(restResponse)
  })
})
