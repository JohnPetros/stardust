import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateGuideUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  body: {
    guideTitle: string
    guideCategory: string
  }
}

export class CreateGuideController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { guideTitle, guideCategory } = await http.getBody()
    const useCase = new CreateGuideUseCase(this.repository)
    const response = await useCase.execute({ guideTitle, guideCategory })
    return http.statusCreated().send(response)
  }
}
