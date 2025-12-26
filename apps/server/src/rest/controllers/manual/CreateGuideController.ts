import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateGuideUseCase } from '@stardust/core/manual/use-cases'
import type { GuideDto } from '@stardust/core/manual/entities/dtos'

type Schema = {
  body: GuideDto
}

export class CreateGuideController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const guideDto = await http.getBody()
    const useCase = new CreateGuideUseCase(this.repository)
    const response = await useCase.execute({ guideDto })
    return http.statusCreated().send(response)
  }
}
