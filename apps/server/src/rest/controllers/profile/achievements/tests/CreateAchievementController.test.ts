import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { AchievementsFaker } from '@stardust/core/profile/entities/fakers'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import { CreateAchievementUseCase } from '@stardust/core/profile/use-cases'
import { CreateAchievementController } from '../CreateAchievementController'

describe('Create Achievement Controller', () => {
  let http: Mock<Http<{ body: ReturnType<typeof AchievementsFaker.fakeDto> }>>
  let repository: Mock<AchievementsRepository>
  let controller: CreateAchievementController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new CreateAchievementController(repository)
    http.statusCreated.mockReturnValue(http)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract body, call use case and return created response', async () => {
    const achievementDto = AchievementsFaker.fakeDto()
    const createdAchievement = AchievementsFaker.fakeDto({ id: 'achievement-id' })
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(achievementDto)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CreateAchievementUseCase.prototype, 'execute')
      .mockResolvedValue(createdAchievement)

    const result = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ achievementDto })
    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(createdAchievement)
    expect(result).toBe(restResponse)
  })
})
