import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { FetchAudioVoicesController } from '../FetchAudioVoicesController'

describe('FetchAudioVoicesController', () => {
  let http: Mock<Http>
  let controller: FetchAudioVoicesController

  beforeEach(() => {
    http = mock()
    controller = new FetchAudioVoicesController()
  })

  it('should return all supported audio voices with their labels', async () => {
    const restResponse = mock<RestResponse>()
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.send).toHaveBeenCalledWith([
      { value: 'panda', label: 'Panda' },
      { value: 'shark', label: 'Tubarão' },
      { value: 'princess', label: 'Princesa' },
      { value: 'alien', label: 'Alien' },
      { value: 'robot', label: 'Robô' },
      { value: 'salmonense', label: 'Salmonense' },
    ])
    expect(response).toBe(restResponse)
  })
})
