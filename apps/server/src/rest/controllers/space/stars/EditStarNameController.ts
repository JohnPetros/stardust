import { EditStarNameUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    name: string
  }
}

export class EditStarNameController implements Controller<Schema> {
  constructor(private readonly starsRepository: StarsRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { name } = await http.getBody()
    const useCase = new EditStarNameUseCase(this.starsRepository)
    const star = await useCase.execute({ starId, name })
    return http.statusOk().send(star)
  }
}
