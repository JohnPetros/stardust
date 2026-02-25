import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { FetchCompletedChallengesCountByDifficultyLevelController } from '../FetchCompletedChallengesCountByDifficultyLevelController'

describe('Fetch Completed Challenges Count By Difficulty Level Controller', () => {
  type Schema = {
    body: {
      userCompletedChallengesIds: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchCompletedChallengesCountByDifficultyLevelController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchCompletedChallengesCountByDifficultyLevelController(repository)
  })

  it('should count completed challenges by difficulty and send response', async () => {
    const userId = IdFaker.fake().value
    const userCompletedChallengesIds = [IdFaker.fake().value, IdFaker.fake().value]
    const output = {
      percentage: { easy: 50, medium: 50, hard: 0 },
      absolute: { easy: 1, medium: 1, hard: 0 },
      total: { easy: 2, medium: 2, hard: 2 },
    }
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue({ userCompletedChallengesIds })
    http.getAccount.mockResolvedValue({ id: userId } as never)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CountCompletedChallengesByDifficultyLevelUseCase.prototype, 'execute')
      .mockResolvedValue(output)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      userCompletedChallengesIds,
    })
    expect(http.send).toHaveBeenCalledWith(output)
    expect(response).toBe(restResponse)
  })
})
