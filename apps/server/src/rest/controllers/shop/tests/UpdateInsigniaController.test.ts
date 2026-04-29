import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import { UpdateInsigniaUseCase } from '@stardust/core/shop/use-cases'

import { UpdateInsigniaController } from '../UpdateInsigniaController'

describe('Update Insignia Controller', () => {
  type Schema = {
    routeParams: {
      insigniaId: string
    }
    body: ReturnType<typeof InsigniasFaker.fakeDto>
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<InsigniasRepository>
  let controller: UpdateInsigniaController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new UpdateInsigniaController(repository)
  })

  it('should extract route params and body, inject dto id, update insignia and send response', async () => {
    const insigniaId = IdFaker.fake().value
    const insigniaDto = InsigniasFaker.fakeDto()
    const updatedInsigniaDto = InsigniasFaker.fakeDto({ id: insigniaId })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ insigniaId })
    http.getBody.mockResolvedValue(insigniaDto)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdateInsigniaUseCase.prototype, 'execute')
      .mockResolvedValue(updatedInsigniaDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(insigniaDto.id).toBe(insigniaId)
    expect(executeSpy).toHaveBeenCalledWith({ insigniaDto })
    expect(http.send).toHaveBeenCalledWith(updatedInsigniaDto)
    expect(response).toBe(restResponse)
  })
})
