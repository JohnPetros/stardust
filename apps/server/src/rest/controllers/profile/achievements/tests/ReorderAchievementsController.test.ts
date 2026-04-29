import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import { ReorderAchievementsUseCase } from '@stardust/core/profile/use-cases'

import { ReorderAchievementsController } from '../ReorderAchievementsController'

describe('Reorder Achievements Controller', () => {
  type Schema = {
    body: {
      achievementIds: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<AchievementsRepository>
  let controller: ReorderAchievementsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new ReorderAchievementsController(repository)
    http.statusOk.mockReturnValue(http)
  })

  it('should extract body.achievementIds, call use case and return ok response', async () => {
    const body = {
      achievementIds: [IdFaker.fake().value, IdFaker.fake().value, IdFaker.fake().value],
    }
    const reorderedAchievements = [
      AchievementsFaker.fakeDto({ id: body.achievementIds[0], position: 1 }),
    ]
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ReorderAchievementsUseCase.prototype, 'execute')
      .mockResolvedValue(reorderedAchievements)

    const response = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ achievementIds: body.achievementIds })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(reorderedAchievements)
    expect(response).toBe(restResponse)
  })

  it('should forward empty achievementIds to use case', async () => {
    const body = { achievementIds: [] }
    const reorderedAchievements: [] = []

    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(ReorderAchievementsUseCase.prototype, 'execute')
      .mockResolvedValue(reorderedAchievements)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ achievementIds: [] })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(reorderedAchievements)
  })
})
