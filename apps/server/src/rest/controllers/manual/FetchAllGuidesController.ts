import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

export class FetchAllGuidesController implements Controller {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http) {
    const guides = await this.repository.findAll()
    return http.send(guides.map((guide) => guide.dto))
  }
}
