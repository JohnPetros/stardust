import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { EditChallengeStarUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { EditChallengeStarController } from '../EditChallengeStarController'

describe('Edit Challenge Star Controller', () => {
  type Schema = {
    routeParams: { challengeId: string }
    body: { starId: string }
  }
  let http: Mock<Http<Schema>>
  let useCase: Mock<EditChallengeStarUseCase>
  let controller: EditChallengeStarController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new EditChallengeStarController(useCase)
  })

  it('passes the route and body identifiers to the use case', async () => {
    const challengeId = IdFaker.fake().value
    const starId = IdFaker.fake().value
    const challengeDto = ChallengesFaker.fakeDto({ id: challengeId })
    const response = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getBody.mockResolvedValue({ starId })
    http.send.mockReturnValue(response)
    useCase.execute.mockResolvedValue(challengeDto)

    await expect(controller.handle(http)).resolves.toBe(response)
    expect(useCase.execute).toHaveBeenCalledWith({ challengeId, starId })
    expect(http.send).toHaveBeenCalledWith(challengeDto)
  })
})
