import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { SearchEmbeddingsUseCase } from '@stardust/core/storage/use-cases'

import { SearchEmbeddingsController } from '../SearchEmbeddingsController'

describe('Search Embeddings Controller', () => {
  type Schema = {
    queryParams: {
      query: string
      namespace: string
      topK: number
    }
  }

  let http: Mock<Http<Schema>>
  let useCase: Mock<SearchEmbeddingsUseCase>
  let controller: SearchEmbeddingsController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new SearchEmbeddingsController(useCase)
  })

  it('should read query params, call use case and send response', async () => {
    const queryParams = {
      query: 'como usar for em javascript',
      namespace: 'guides',
      topK: 3,
    }
    const results = ['Guia de loops', 'Guia de arrays', 'Guia de funções']
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(queryParams)
    useCase.execute.mockResolvedValue(results)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(useCase.execute).toHaveBeenCalledWith({
      query: queryParams.query,
      namespace: queryParams.namespace,
      topK: queryParams.topK,
    })
    expect(http.send).toHaveBeenCalledWith(results)
    expect(response).toBe(restResponse)
  })
})
