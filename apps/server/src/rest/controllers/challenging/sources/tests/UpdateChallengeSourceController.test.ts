import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeSourcesFaker } from '@stardust/core/challenging/entities/fakers'
import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { UpdateChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { UpdateChallengeSourceController } from '../UpdateChallengeSourceController'

describe('Update Challenge Source Controller', () => {
  type Schema = {
    routeParams: {
      challengeSourceId: string
    }
    body: {
      challengeId?: string | null
      url: string
      additionalInstructions?: string | null
    }
  }

  let http: Mock<Http<Schema>>
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let challengesRepository: Mock<ChallengesRepository>
  let controller: UpdateChallengeSourceController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    challengeSourcesRepository = mock()
    challengesRepository = mock()
    controller = new UpdateChallengeSourceController(
      challengeSourcesRepository,
      challengesRepository,
    )
  })

  it('should read additional instructions from body, call use case and send dto', async () => {
    const routeParams = {
      challengeSourceId: '550e8400-e29b-41d4-a716-446655440099',
    }
    const body = {
      challengeId: '550e8400-e29b-41d4-a716-446655440015',
      url: 'https://updated-source.stardust.dev',
      additionalInstructions: 'Prefer graph examples with weighted edges.',
    }
    const updatedChallengeSourceDto = ChallengeSourcesFaker.fakeDto({
      id: routeParams.challengeSourceId,
      challenge: {
        id: body.challengeId,
        title: 'Graphs',
        slug: 'graphs',
      },
      url: body.url,
      additionalInstructions: body.additionalInstructions,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdateChallengeSourceUseCase.prototype, 'execute')
      .mockResolvedValue(updatedChallengeSourceDto)

    const response = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({
      challengeSourceId: routeParams.challengeSourceId,
      challengeId: body.challengeId,
      url: body.url,
      additionalInstructions: body.additionalInstructions,
    })
    expect(http.send).toHaveBeenCalledWith(updatedChallengeSourceDto)
    expect(response).toBe(restResponse)
  })
})
