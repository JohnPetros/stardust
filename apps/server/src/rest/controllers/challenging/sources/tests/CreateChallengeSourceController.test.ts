import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeSourcesFaker } from '@stardust/core/challenging/entities/fakers'
import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { CreateChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { CreateChallengeSourceController } from '../CreateChallengeSourceController'

describe('Create Challenge Source Controller', () => {
  type Schema = {
    body: {
      challengeId?: string | null
      url: string
      additionalInstructions?: string | null
    }
  }

  let http: Mock<Http<Schema>>
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let challengesRepository: Mock<ChallengesRepository>
  let controller: CreateChallengeSourceController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    challengeSourcesRepository = mock()
    challengesRepository = mock()
    controller = new CreateChallengeSourceController(
      challengeSourcesRepository,
      challengesRepository,
    )
  })

  it('should read additional instructions from body, call use case and send created dto', async () => {
    const body = {
      challengeId: '550e8400-e29b-41d4-a716-446655440015',
      url: 'https://source.stardust.dev',
      additionalInstructions: 'Adapt examples to binary trees.',
    }
    const createdChallengeSourceDto = ChallengeSourcesFaker.fakeDto({
      challenge: {
        id: body.challengeId,
        title: 'Binary Trees',
        slug: 'binary-trees',
      },
      url: body.url,
      additionalInstructions: body.additionalInstructions,
    })
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CreateChallengeSourceUseCase.prototype, 'execute')
      .mockResolvedValue(createdChallengeSourceDto)

    const response = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({
      challengeId: body.challengeId,
      url: body.url,
      additionalInstructions: body.additionalInstructions,
    })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(createdChallengeSourceDto)
    expect(response).toBe(restResponse)
  })
})
