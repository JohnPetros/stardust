import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { DeleteGuideUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  routeParams: {
    guideId: string
  }
}

export class DeleteGuideController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const useCase = new DeleteGuideUseCase(this.repository)
    await useCase.execute({ guideId })
    return http.statusNoContent().send()
  }
}
