import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import type { StarsRepository } from '@stardust/core/space/interfaces'
import { GetStarUseCase } from '@stardust/core/space/use-cases'

import { FetchStarController } from '../FetchStarController'

describe('Fetch Star Controller', () => {
  type Schema = {
    routeParams: {
      starSlug?: string
      starId?: string
    }
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<StarsRepository>
  let controller: FetchStarController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchStarController(repository)
    http.statusOk.mockReturnValue(http)
  })

  it('should read route params, execute use case and send ok response with star dto', async () => {
    const routeParams = {
      starSlug: 'variables-basics',
      starId: 'star-id-123',
    }
    const starDto = StarsFaker.fakeDto({
      id: routeParams.starId,
      slug: routeParams.starSlug,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetStarUseCase.prototype, 'execute')
      .mockResolvedValue(starDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith(routeParams)
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(starDto)
    expect(response).toBe(restResponse)
  })
})
