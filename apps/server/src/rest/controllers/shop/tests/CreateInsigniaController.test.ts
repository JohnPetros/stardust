import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import { CreateInsigniaUseCase } from '@stardust/core/shop/use-cases'
import { CreateInsigniaController } from '../CreateInsigniaController'

describe('Create Insignia Controller', () => {
  let http: Mock<Http<{ body: ReturnType<typeof InsigniasFaker.fakeDto> }>>
  let repository: Mock<InsigniasRepository>
  let controller: CreateInsigniaController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new CreateInsigniaController(repository)
    http.statusCreated.mockReturnValue(http)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract body, call use case and return created response', async () => {
    const insigniaDto = InsigniasFaker.fakeDto()
    const createdInsignia = InsigniasFaker.fakeDto()
    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(insigniaDto)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CreateInsigniaUseCase.prototype, 'execute')
      .mockResolvedValue(createdInsignia)

    const result = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ insigniaDto })
    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(createdInsignia)
    expect(result).toBe(restResponse)
  })
})
