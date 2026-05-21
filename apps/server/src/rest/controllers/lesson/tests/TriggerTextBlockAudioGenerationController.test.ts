import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { RestResponse } from '@stardust/core/global/responses'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { TriggerTextBlockAudioGenerationUseCase } from '@stardust/core/lesson/use-cases'

import { TriggerTextBlockAudioGenerationController } from '../TriggerTextBlockAudioGenerationController'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    blockIndex: number
    voice: string
  }
}

describe('Trigger TextBlock Audio Generation Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<TextBlocksRepository>
  let broker: Mock<Broker>
  let controller: TriggerTextBlockAudioGenerationController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock<Http<Schema>>()
    repository = mock<TextBlocksRepository>()
    broker = mock<Broker>()
    controller = new TriggerTextBlockAudioGenerationController(repository, broker)
  })

  it('should extract params and body, call the use case and return accepted', async () => {
    const response = [{ type: 'default', content: 'Texto', isRunnable: false }]
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ starId: 'star-id' })
    http.getBody.mockResolvedValue({ blockIndex: 2, voice: 'shark' })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(TriggerTextBlockAudioGenerationUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const result = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(http.getBody).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({
      starId: 'star-id',
      blockIndex: 2,
      voice: 'shark',
    })
    expect(http.send).toHaveBeenCalledWith(response, HTTP_STATUS_CODE.accepted)
    expect(result).toBe(restResponse)
  })
})
