import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import { DeleteRocketUseCase } from '@stardust/core/shop/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    rocketId: string
  }
}

export class DeleteRocketController implements Controller<Schema> {
  constructor(private readonly repository: RocketsRepository) {}

  async handle(http: Http<Schema>) {
    const { rocketId } = http.getRouteParams()
    const useCase = new DeleteRocketUseCase(this.repository)
    await useCase.execute({ rocketId })
    return http.statusNoContent().send()
  }
}
