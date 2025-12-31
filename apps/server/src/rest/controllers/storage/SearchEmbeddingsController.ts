import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SearchEmbeddingsUseCase } from '@stardust/core/storage/use-cases'

type Schema = {
  queryParams: {
    query: string
    namespace: string
    topK: number
  }
}

export class SearchEmbeddingsController implements Controller {
  constructor(private readonly useCase: SearchEmbeddingsUseCase) {}

  async handle(http: Http<Schema>) {
    const { query, namespace, topK } = http.getQueryParams()
    const results = await this.useCase.execute({
      query,
      namespace,
      topK,
    })
    return http.send(results)
  }
}
