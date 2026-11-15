import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import { GetCurrentGalaxyUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  body: {
    storedGalaxyId: string | null
  }
}

export class ResolveCurrentGalaxyController implements Controller<Schema> {
  constructor(private readonly galaxiesRepository: GalaxiesRepository) {}

  async handle(http: Http<Schema>) {
    const { storedGalaxyId } = await http.getBody()
    const useCase = new GetCurrentGalaxyUseCase(this.galaxiesRepository)
    const currentGalaxy = await useCase.execute({ currentGalaxyId: storedGalaxyId })
    http.extendBody({ currentGalaxy })
    return http.pass()
  }
}
