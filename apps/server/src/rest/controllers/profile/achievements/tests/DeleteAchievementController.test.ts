import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import { DeleteAchievementUseCase } from '@stardust/core/profile/use-cases'

import { DeleteAchievementController } from '../DeleteAchievementController'

describe('Delete Achievement Controller', () => {
  let http: Mock<Http<{ routeParams: { achievementId: string } }>>
  let repository: Mock<AchievementsRepository>
  let controller: DeleteAchievementController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new DeleteAchievementController(repository)
  })

  it('should extract route params, execute use case and return no content', async () => {
    const achievementId = IdFaker.fake().value
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ achievementId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(DeleteAchievementUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({ achievementId })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalled()
    expect(response).toBe(restResponse)
  })
})
