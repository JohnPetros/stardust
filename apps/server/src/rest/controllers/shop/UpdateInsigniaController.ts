import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateInsigniaUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  routeParams: {
    insigniaId: string
  }
  body: InsigniaDto
}

export class UpdateInsigniaController implements Controller<Schema> {
  constructor(private readonly repository: InsigniasRepository) {}

  async handle(http: Http<Schema>) {
    const { insigniaId } = http.getRouteParams()
    const insigniaDto = await http.getBody()
    insigniaDto.id = insigniaId
    const useCase = new UpdateInsigniaUseCase(this.repository)
    const response = await useCase.execute({ insigniaDto })
    return http.send(response)
  }
}
