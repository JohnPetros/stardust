import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import { InsigniasFaker } from '@stardust/core/shop/entities/fakers'
import { FetchInsigniasListController } from '../FetchInsigniasListController'

describe('Fetch Insignias List Controller', () => {
  let http: Mock<Http>
  let repository: Mock<InsigniasRepository>
  let controller: FetchInsigniasListController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new FetchInsigniasListController(repository)
  })

  it('should fetch only purchasable insignias from repository', async () => {
    const insignias = InsigniasFaker.fakeMany(2)
    const restResponse = mock<RestResponse>()

    repository.findAllPurchasable.mockResolvedValue(insignias)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(repository.findAllPurchasable).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(insignias.map((insignia) => insignia.dto))
    expect(response).toBe(restResponse)
  })
})
