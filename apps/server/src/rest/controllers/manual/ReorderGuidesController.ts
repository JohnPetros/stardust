import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import { ReorderGuidesUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  body: {
    guideIds: string[]
  }
}

export class ReorderGuidesController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { guideIds } = await http.getBody()
    const useCase = new ReorderGuidesUseCase(this.repository)
    await useCase.execute({ guideIds })
    return http.statusNoContent().send()
  }
}
