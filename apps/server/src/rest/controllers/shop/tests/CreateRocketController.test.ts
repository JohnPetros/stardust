import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import { RocketsFaker } from '@stardust/core/shop/entities/fakers'
import { CreateRocketController } from '../CreateRocketController'

type Schema = {
  body: ReturnType<typeof RocketsFaker.fake>['dto']
}

describe('Create Rocket Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<RocketsRepository>
  let controller: CreateRocketController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new CreateRocketController(repository)
  })

  it('should read body, create rocket and send created response', async () => {
    const rocketDto = RocketsFaker.fake().dto
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(rocketDto)
    repository.add.mockResolvedValue()
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add.mock.calls[0][0].dto).toEqual(rocketDto)
    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(rocketDto)
    expect(response).toBe(restResponse)
  })
})
