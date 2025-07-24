import { GetStarUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    starId: string
  }
}

export class VerifyStarExistsController implements Controller<Schema> {
  constructor(private readonly repository: StarsRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const useCase = new GetStarUseCase(this.repository)
    await useCase.execute({ starId })
    return http.pass()
  }
}
