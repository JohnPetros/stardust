import { GalaxiesFaker } from '#space/domain/entities/fakers/GalaxiesFaker'
import type { GalaxyAggregateDto } from '../dtos'
import { GalaxyAggregate } from '../GalaxyAggregate'

export class GalaxyAggregatesFaker {
  static fake(): GalaxyAggregate {
    return GalaxyAggregate.create(GalaxyAggregatesFaker.fakeDto())
  }

  static fakeDto(): GalaxyAggregateDto {
    const fakeGalaxy = GalaxiesFaker.fake()

    return {
      id: fakeGalaxy.id.value,
      entity: {
        name: fakeGalaxy.name.value,
        slug: fakeGalaxy.slug.value,
      },
    }
  }
}
