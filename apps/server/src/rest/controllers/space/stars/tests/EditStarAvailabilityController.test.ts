import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import type { StarsRepository } from '@stardust/core/space/interfaces'
import { EditStarAvailabilityUseCase } from '@stardust/core/space/use-cases'

import { EditStarAvailabilityController } from '../EditStarAvailabilityController'

describe('Edit Star Availability Controller', () => {
  let http: Mock<
    Http<{ routeParams: { starId: string }; body: { isAvailable: boolean } }>
  >
  let repository: Mock<StarsRepository>
  let controller: EditStarAvailabilityController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new EditStarAvailabilityController(repository)
    http.statusOk.mockReturnValue(http)
  })

  it('should read route params and body, call use case and return ok response', async () => {
    const starDto = StarsFaker.fakeDto()
    const starId = starDto.id ?? 'star-1'
    const isAvailable = true
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ starId })
    http.getBody.mockResolvedValue({ isAvailable })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(EditStarAvailabilityUseCase.prototype, 'execute')
      .mockResolvedValue(starDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ starId, isAvailable })
    expect(http.statusOk).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(starDto)
    expect(response).toBe(restResponse)
  })
})
