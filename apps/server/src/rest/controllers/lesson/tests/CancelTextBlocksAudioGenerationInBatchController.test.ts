import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker, Http } from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { RestResponse } from '@stardust/core/global/responses'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { CancelTextBlocksAudioGenerationInBatchUseCase } from '@stardust/core/lesson/use-cases'

import { CancelTextBlocksAudioGenerationInBatchController } from '../CancelTextBlocksAudioGenerationInBatchController'

type Schema = {
  routeParams: {
    starId: string
  }
}

describe('Cancel TextBlocks Audio Generation In Batch Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<TextBlocksRepository>
  let broker: Mock<Broker>
  let controller: CancelTextBlocksAudioGenerationInBatchController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock<Http<Schema>>()
    repository = mock<TextBlocksRepository>()
    broker = mock<Broker>()
    controller = new CancelTextBlocksAudioGenerationInBatchController(repository, broker)
  })

  it('should extract route params, call the use case and return accepted', async () => {
    const response = [{ type: 'default', content: 'Texto', isRunnable: false }]
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ starId: 'star-id' })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CancelTextBlocksAudioGenerationInBatchUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const result = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({ starId: 'star-id' })
    expect(http.send).toHaveBeenCalledWith(response, HTTP_STATUS_CODE.accepted)
    expect(result).toBe(restResponse)
  })
})
