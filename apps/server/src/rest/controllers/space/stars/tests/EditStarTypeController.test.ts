import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import type { StarsRepository } from '@stardust/core/space/interfaces'
import { EditStarTypeUseCase } from '@stardust/core/space/use-cases'

import { EditStarTypeController } from '../EditStarTypeController'

describe('Edit Star Type Controller', () => {
  type Schema = {
    routeParams: {
      starId: string
    }
    body: {
      isChallenge: boolean
    }
  }

  let http: Mock<Http<Schema>>
  let starsRepository: Mock<StarsRepository>
  let controller: EditStarTypeController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    starsRepository = mock()
    controller = new EditStarTypeController(starsRepository)
  })

  it('should read route params and body, execute use case and send ok response', async () => {
    const routeParams = { starId: IdFaker.fake().value }
    const body = { isChallenge: true }
    const starDto = StarsFaker.fakeDto({
      id: routeParams.starId,
      isChallenge: body.isChallenge,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(EditStarTypeUseCase.prototype, 'execute')
      .mockResolvedValue(starDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(http.getBody).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({
      starId: routeParams.starId,
      isChallenge: body.isChallenge,
    })
    expect(http.statusOk).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(starDto)
    expect(response).toBe(restResponse)
  })
})
