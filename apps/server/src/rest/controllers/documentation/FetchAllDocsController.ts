import type { DocsRepository } from '@stardust/core/documentation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

export class FetchAllDocsController implements Controller {
  constructor(private readonly repository: DocsRepository) {}

  async handle(http: Http) {
    const docs = await this.repository.findAll()
    return http.send(docs.map((doc) => doc.dto))
  }
}
