import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import { DeleteInsigniaUseCase } from '@stardust/core/shop/use-cases'
import { DeleteInsigniaController } from '../DeleteInsigniaController'

type Schema = {
  routeParams: {
    insigniaId: string
  }
}

describe('Delete Insignia Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<InsigniasRepository>
  let controller: DeleteInsigniaController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new DeleteInsigniaController(repository)
  })

  it('should extract insigniaId from route params and delete insignia', async () => {
    const insigniaId = 'insignia-id'
    const executeSpy = jest
      .spyOn(DeleteInsigniaUseCase.prototype, 'execute')
      .mockResolvedValue()

    http.getRouteParams.mockReturnValue({ insigniaId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(mock<RestResponse>())

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ insigniaId })
  })

  it('should respond with statusNoContent().send()', async () => {
    const insigniaId = 'insignia-id'
    const restResponse = mock<RestResponse>()

    jest.spyOn(DeleteInsigniaUseCase.prototype, 'execute').mockResolvedValue()
    http.getRouteParams.mockReturnValue({ insigniaId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.statusNoContent).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledTimes(1)
    expect(response).toBe(restResponse)
  })
})
