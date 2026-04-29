import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import { DeleteRocketUseCase } from '@stardust/core/shop/use-cases'
import { DeleteRocketController } from '../DeleteRocketController'

type Schema = {
  routeParams: {
    rocketId: string
  }
}

describe('Delete Rocket Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<RocketsRepository>
  let controller: DeleteRocketController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new DeleteRocketController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract rocketId from route params and delete rocket', async () => {
    const rocketId = 'rocket-id'
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(DeleteRocketUseCase.prototype, 'execute')
      .mockResolvedValue()

    http.getRouteParams.mockReturnValue({ rocketId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ rocketId })
  })

  it('should respond with statusNoContent().send()', async () => {
    const rocketId = 'rocket-id'
    const restResponse = mock<RestResponse>()

    jest.spyOn(DeleteRocketUseCase.prototype, 'execute').mockResolvedValue()
    http.getRouteParams.mockReturnValue({ rocketId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.statusNoContent).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledTimes(1)
    expect(response).toBe(restResponse)
  })
})
