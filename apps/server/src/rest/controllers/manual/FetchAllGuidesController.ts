import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { GuideCategory } from '@stardust/core/manual/structures'

type Schema = {
  queryParams: {
    category: string
  }
}

export class FetchAllGuidesController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { category } = http.getQueryParams()
    const guides = await this.repository.findAllByCategory(GuideCategory.create(category))
    return http.send(guides.map((guide) => guide.dto))
  }
}
