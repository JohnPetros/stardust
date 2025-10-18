import { EditStarTypeUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    isChallenge: boolean
  }
}

export class EditStarTypeController implements Controller<Schema> {
  constructor(private readonly starsRepository: StarsRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { isChallenge } = await http.getBody()
    const useCase = new EditStarTypeUseCase(this.starsRepository)
    const star = await useCase.execute({ starId, isChallenge })
    return http.statusOk().send(star)
  }
}
