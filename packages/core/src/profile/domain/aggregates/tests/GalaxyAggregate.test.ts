import { GalaxyAggregate } from '../GalaxyAggregate'
import { GalaxyAggregatesFaker } from '../fakers'

describe('GalaxyAggregate', () => {
  it('should load the referenced galaxy entity from the dto', () => {
    const dto = GalaxyAggregatesFaker.fakeDto()

    const aggregate = GalaxyAggregate.create(dto)

    expect(aggregate.id.value).toBe(dto.id)
    expect(aggregate.name.value).toBe(dto.entity?.name)
    expect(aggregate.slug.value).toBe(dto.entity?.slug)
  })

  it('should keep only the galaxy id when the entity is not loaded', () => {
    const { id } = GalaxyAggregatesFaker.fakeDto()

    const aggregate = GalaxyAggregate.create({ id })

    expect(aggregate.id.value).toBe(id)
    expect(aggregate.dto).toEqual({ id, entity: undefined })
  })

  it('should return the same dto it was created from', () => {
    const dto = GalaxyAggregatesFaker.fakeDto()

    expect(GalaxyAggregate.create(dto).dto).toEqual(dto)
  })
})
