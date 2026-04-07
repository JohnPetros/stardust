import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { FetchChallengesCompletionProgressUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { FetchChallengesCompletionProgressController } from '../FetchChallengesCompletionProgressController'

describe('Fetch Challenges Completion Progress Controller', () => {
  type Schema = {
    body: {
      userCompletedChallengesIds?: string[]
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: FetchChallengesCompletionProgressController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchChallengesCompletionProgressController(repository)
  })

  it('should read user completed challenges ids from body and send completed count for authenticated account', async () => {
    const userCompletedChallengesIds = [IdFaker.fake().value, IdFaker.fake().value]
    const output = {
      completedChallengesCount: 2,
      totalChallengesCount: 10,
    }
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue({ userCompletedChallengesIds })
    http.getAccount.mockResolvedValue({ id: IdFaker.fake().value } as never)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(FetchChallengesCompletionProgressUseCase.prototype, 'execute')
      .mockResolvedValue(output)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userCompletedChallengesIds })
    expect(executeSpy.mock.instances[0]).toHaveProperty('repository', repository)
    expect(http.send).toHaveBeenCalledWith(output)
    expect(response).toBe(restResponse)
  })

  it('should send null completed count when there is no authenticated account', async () => {
    const output = {
      completedChallengesCount: 3,
      totalChallengesCount: 8,
    }
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue({})
    http.getAccount.mockResolvedValue(undefined as never)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(FetchChallengesCompletionProgressUseCase.prototype, 'execute')
      .mockResolvedValue(output)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userCompletedChallengesIds: [] })
    expect(executeSpy.mock.instances[0]).toHaveProperty('repository', repository)
    expect(http.send).toHaveBeenCalledWith({
      completedChallengesCount: null,
      totalChallengesCount: output.totalChallengesCount,
    })
  })
})
