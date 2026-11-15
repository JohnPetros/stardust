import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import { GetGalaxyUseCase } from '@stardust/core/space/use-cases'
import type { GalaxyAggregateDto } from '@stardust/core/profile/aggregates/dtos'

type Schema = {
  body: {
    galaxySlug: string
  }
}

export class AppendEnterableGalaxyToBodyController implements Controller<Schema> {
  constructor(private readonly galaxiesRepository: GalaxiesRepository) {}

  async handle(http: Http<Schema>) {
    const { galaxySlug } = await http.getBody()
    const useCase = new GetGalaxyUseCase(this.galaxiesRepository)
    const galaxy = await useCase.execute({ galaxySlug, shouldBeEnterable: true })
    const galaxyAggregate: GalaxyAggregateDto = {
      id: String(galaxy.id),
      entity: { name: galaxy.name, slug: galaxy.slug },
    }
    http.extendBody({ galaxy: galaxyAggregate })
    return http.pass()
  }
}
