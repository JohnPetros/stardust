import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'

import { FetchAllAchievementsController } from '../FetchAllAchievementsController'

describe('Fetch All Achievements Controller', () => {
  let http: Mock<Http>
  let repository: Mock<AchievementsRepository>
  let controller: FetchAllAchievementsController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new FetchAllAchievementsController(repository)
  })

  it('should fetch all achievements and send mapped dto list', async () => {
    const achievements = AchievementsFaker.fakeMany(3)
    const restResponse = mock<RestResponse>()

    repository.findAll.mockResolvedValue(achievements)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(
      achievements.map((achievement) => achievement.dto),
    )
    expect(response).toBe(restResponse)
  })
})
