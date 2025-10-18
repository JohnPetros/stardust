import { EditStarAvailabilityUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    isAvailable: boolean
  }
}

export class EditStarAvailabilityController implements Controller<Schema> {
  constructor(private readonly starsRepository: StarsRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { isAvailable } = await http.getBody()
    const useCase = new EditStarAvailabilityUseCase(this.starsRepository)
    const star = await useCase.execute({ starId, isAvailable })
    return http.statusOk().send(star)
  }
}
