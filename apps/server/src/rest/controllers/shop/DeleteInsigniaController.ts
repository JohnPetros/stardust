import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import { DeleteInsigniaUseCase } from '@stardust/core/shop/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    insigniaId: string
  }
}

export class DeleteInsigniaController implements Controller<Schema> {
  constructor(private readonly repository: InsigniasRepository) {}

  async handle(http: Http<Schema>) {
    const { insigniaId } = http.getRouteParams()
    const useCase = new DeleteInsigniaUseCase(this.repository)
    await useCase.execute({ insigniaId })
    return http.statusNoContent().send()
  }
}
