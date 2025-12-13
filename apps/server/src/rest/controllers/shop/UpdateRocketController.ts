import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateRocketUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  routeParams: {
    rocketId: string
  }
  body: RocketDto
}

export class UpdateRocketController implements Controller<Schema> {
  constructor(private readonly repository: RocketsRepository) {}

  async handle(http: Http<Schema>) {
    const { rocketId } = http.getRouteParams()
    const rocketDto = await http.getBody()
    rocketDto.id = rocketId
    const useCase = new UpdateRocketUseCase(this.repository)
    const response = await useCase.execute({ rocketDto })
    return http.send(response)
  }
}
