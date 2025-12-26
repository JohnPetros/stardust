import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { EditGuideTitleUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  routeParams: {
    guideId: string
  }
  body: {
    guideTitle: string
  }
}

export class EditGuideTitleController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const { guideTitle } = await http.getBody()
    const useCase = new EditGuideTitleUseCase(this.repository)
    const response = await useCase.execute({ guideId, guideTitle })
    return http.send(response)
  }
}
