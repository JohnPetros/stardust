import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateInsigniaUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  body: InsigniaDto
}

export class CreateInsigniaController implements Controller<Schema> {
  constructor(private readonly repository: InsigniasRepository) {}

  async handle(http: Http<Schema>) {
    const insigniaDto = await http.getBody()
    const useCase = new CreateInsigniaUseCase(this.repository)
    const response = await useCase.execute({ insigniaDto })
    return http.statusCreated().send(response)
  }
}
