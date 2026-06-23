import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { GetGuidesUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  queryParams: {
    category: string
  }
}

export class FetchGuidesController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { category } = http.getQueryParams()
    const useCase = new GetGuidesUseCase(this.repository)
    const response = await useCase.execute({ category })
    return http.send(response)
  }
}
