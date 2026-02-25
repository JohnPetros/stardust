import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { UpdateChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { UpdateChallengeController } from '../UpdateChallengeController'

describe('Update Challenge Controller', () => {
  type Schema = {
    routeParams: {
      challengeId: string
    }
    body: ReturnType<typeof ChallengesFaker.fakeDto>
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<ChallengesRepository>
  let controller: UpdateChallengeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new UpdateChallengeController(repository)
  })

  it('should set route id on dto, update challenge and send response', async () => {
    const challengeId = IdFaker.fake().value
    const challengeDto = ChallengesFaker.fakeDto()
    const updatedChallengeDto = ChallengesFaker.fakeDto({ id: challengeId })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getBody.mockResolvedValue(challengeDto)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdateChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(updatedChallengeDto)

    const response = await controller.handle(http)

    expect(challengeDto.id).toBe(challengeId)
    expect(executeSpy).toHaveBeenCalledWith({ challengeDto })
    expect(http.send).toHaveBeenCalledWith(updatedChallengeDto)
    expect(response).toBe(restResponse)
  })
})
