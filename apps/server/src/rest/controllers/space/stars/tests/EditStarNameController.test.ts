import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import type { StarsRepository } from '@stardust/core/space/interfaces'
import { EditStarNameUseCase } from '@stardust/core/space/use-cases'

import { EditStarNameController } from '../EditStarNameController'

describe('Edit Star Name Controller', () => {
  type Schema = {
    routeParams: {
      starId: string
    }
    body: {
      name: string
    }
  }

  let http: Mock<Http<Schema>>
  let starsRepository: Mock<StarsRepository>
  let controller: EditStarNameController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    starsRepository = mock()
    controller = new EditStarNameController(starsRepository)
  })

  it('should read route params and body, call use case and send ok response', async () => {
    const routeParams = { starId: IdFaker.fake().value }
    const body = { name: 'Updated Star Name' }
    const starDto = StarsFaker.fakeDto({ id: routeParams.starId, name: body.name })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(EditStarNameUseCase.prototype, 'execute')
      .mockResolvedValue(starDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      starId: routeParams.starId,
      name: body.name,
    })
    expect(http.statusOk).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(starDto)
    expect(response).toBe(restResponse)
  })
})
