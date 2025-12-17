import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateRocketUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  body: RocketDto
}

export class CreateRocketController implements Controller<Schema> {
  constructor(private readonly repository: RocketsRepository) {}

  async handle(http: Http<Schema>) {
    const rocketDto = await http.getBody()
    const useCase = new CreateRocketUseCase(this.repository)
    const response = await useCase.execute({ rocketDto })
    return http.statusCreated().send(response)
  }
}
