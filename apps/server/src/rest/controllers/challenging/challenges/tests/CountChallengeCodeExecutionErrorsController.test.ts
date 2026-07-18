import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengeCodeExecutionsRepository } from '@stardust/core/challenging/interfaces'
import { CountChallengeCodeExecutionErrorsUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { CountChallengeCodeExecutionErrorsController } from '../CountChallengeCodeExecutionErrorsController'

describe('Count Challenge Code Execution Errors Controller', () => {
  type Schema = {
    routeParams: {
      challengeId: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengeCodeExecutionsRepository>
  let controller: CountChallengeCodeExecutionErrorsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new CountChallengeCodeExecutionErrorsController(repository)
  })

  it('should count challenge code execution errors and send response', async () => {
    const userId = IdFaker.fake().value
    const challengeId = IdFaker.fake().value
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getAccountId.mockResolvedValue(userId)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CountChallengeCodeExecutionErrorsUseCase.prototype, 'execute')
      .mockResolvedValue(3)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userId, challengeId })
    expect(http.send).toHaveBeenCalledWith({ errorsCount: 3 })
    expect(response).toBe(restResponse)
  })
})
