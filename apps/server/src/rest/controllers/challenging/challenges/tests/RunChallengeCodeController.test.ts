import { mock, type Mock } from 'ts-jest-mocker'

import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import { RunChallengeCodeUseCase } from '@stardust/core/challenging/use-cases'
import type { Http, LspProvider } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { RunChallengeCodeController } from '../RunChallengeCodeController'

describe('Run Challenge Code Controller', () => {
  type Schema = {
    routeParams: {
      challengeId: string
    }
    body: {
      code: string
    }
  }

  let http: Mock<Http<Schema>>
  let challengesRepository: Mock<ChallengesRepository>
  let executionsRepository: Mock<ChallengeCodeExecutionsRepository>
  let lspProvider: Mock<LspProvider>
  let controller: RunChallengeCodeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    challengesRepository = mock()
    executionsRepository = mock()
    lspProvider = mock()
    controller = new RunChallengeCodeController(
      challengesRepository,
      executionsRepository,
      lspProvider,
    )
  })

  it('should run challenge code and send created response', async () => {
    const userId = IdFaker.fake().value
    const challengeId = IdFaker.fake().value
    const code = 'escreva("ok")'
    const executionDto = ChallengeCodeExecution.create({
      code,
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    }).dto
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getBody.mockResolvedValue({ code })
    http.getAccountId.mockResolvedValue(userId)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(RunChallengeCodeUseCase.prototype, 'execute')
      .mockResolvedValue(executionDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userId, challengeId, code })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(executionDto)
    expect(response).toBe(restResponse)
  })
})
