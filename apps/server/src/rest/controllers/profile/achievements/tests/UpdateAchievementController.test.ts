import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import { UpdateAchievementUseCase } from '@stardust/core/profile/use-cases'

import { UpdateAchievementController } from '../UpdateAchievementController'

describe('Update Achievement Controller', () => {
  type Schema = {
    routeParams: {
      achievementId: string
    }
    body: ReturnType<typeof AchievementsFaker.fakeDto>
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<AchievementsRepository>
  let controller: UpdateAchievementController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new UpdateAchievementController(repository)
  })

  it('should extract route params and body, set dto id, execute use case and send response', async () => {
    const achievementId = IdFaker.fake().value
    const achievementDto = AchievementsFaker.fakeDto()
    const updatedAchievementDto = AchievementsFaker.fakeDto({ id: achievementId })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ achievementId })
    http.getBody.mockResolvedValue(achievementDto)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdateAchievementUseCase.prototype, 'execute')
      .mockResolvedValue(updatedAchievementDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(achievementDto.id).toBe(achievementId)
    expect(executeSpy).toHaveBeenCalledWith({ achievementDto })
    expect(http.send).toHaveBeenCalledWith(updatedAchievementDto)
    expect(response).toBe(restResponse)
  })
})
