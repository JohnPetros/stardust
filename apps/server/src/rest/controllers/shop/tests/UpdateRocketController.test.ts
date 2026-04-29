import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import { RocketsFaker } from '@stardust/core/shop/entities/fakers'
import { UpdateRocketUseCase } from '@stardust/core/shop/use-cases'
import { UpdateRocketController } from '../UpdateRocketController'

type Schema = {
  routeParams: {
    rocketId: string
  }
  body: ReturnType<typeof RocketsFaker.fake>['dto']
}

describe('Update Rocket Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<RocketsRepository>
  let controller: UpdateRocketController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new UpdateRocketController(repository)
    jest.restoreAllMocks()
  })

  it('should combine route params and body and inject rocket id before update', async () => {
    const routeParams = { rocketId: RocketsFaker.fake().dto.id ?? 'rocket-id' }
    const body = RocketsFaker.fake({ id: RocketsFaker.fake().dto.id }).dto
    const useCaseResponse = RocketsFaker.fake({ id: routeParams.rocketId }).dto

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(mock<RestResponse>())

    const executeSpy = jest
      .spyOn(UpdateRocketUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      rocketDto: expect.objectContaining({
        ...body,
        id: routeParams.rocketId,
      }),
    })
  })

  it('should send the update response', async () => {
    const routeParams = { rocketId: RocketsFaker.fake().dto.id ?? 'rocket-id' }
    const body = RocketsFaker.fake().dto
    const useCaseResponse = RocketsFaker.fake({ id: routeParams.rocketId }).dto
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    jest
      .spyOn(UpdateRocketUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.send).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
