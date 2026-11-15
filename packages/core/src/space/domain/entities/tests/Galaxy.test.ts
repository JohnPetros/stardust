import { IdsList } from '#global/domain/structures/IdsList'
import { Id } from '#global/domain/structures/Id'
import { GalaxiesFaker } from '../fakers/GalaxiesFaker'

describe('Galaxy Entity', () => {
  it('should be visible when published or announced', () => {
    expect(GalaxiesFaker.fake({ status: 'published' }).isVisible.isTrue).toBe(true)
    expect(GalaxiesFaker.fake({ status: 'announced' }).isVisible.isTrue).toBe(true)
  })

  it('should not be visible when unpublished', () => {
    expect(GalaxiesFaker.fake({ status: 'unpublished' }).isVisible.isFalse).toBe(true)
  })

  it('should be enterable only when published', () => {
    expect(GalaxiesFaker.fake({ status: 'published' }).canBeEntered.isTrue).toBe(true)
    expect(GalaxiesFaker.fake({ status: 'announced' }).canBeEntered.isFalse).toBe(true)
    expect(GalaxiesFaker.fake({ status: 'unpublished' }).canBeEntered.isFalse).toBe(true)
  })

  it('should count its planets', () => {
    const planetsIds = [Id.create().value, Id.create().value, Id.create().value]

    const galaxy = GalaxiesFaker.fake({ planetsIds })

    expect(galaxy.planetsCount.value).toBe(3)
  })

  it('should have zero planets when it has no planets', () => {
    const galaxy = GalaxiesFaker.fake({ planetsIds: [] })

    expect(galaxy.planetsCount.isZero.isTrue).toBe(true)
  })

  it('should count zero completed planets when none of its planets is completed', () => {
    const galaxy = GalaxiesFaker.fake({
      planetsIds: [Id.create().value, Id.create().value],
    })
    const completedPlanetsIds = IdsList.create([Id.create().value])

    expect(galaxy.countCompletedPlanets(completedPlanetsIds).value).toBe(0)
  })

  it('should count only the completed planets that belong to the galaxy', () => {
    const planetsIds = [Id.create().value, Id.create().value, Id.create().value]
    const galaxy = GalaxiesFaker.fake({ planetsIds })
    const completedPlanetsIds = IdsList.create([planetsIds[0], Id.create().value])

    expect(galaxy.countCompletedPlanets(completedPlanetsIds).value).toBe(1)
  })

  it('should count all of its planets when all of them are completed', () => {
    const planetsIds = [Id.create().value, Id.create().value]
    const galaxy = GalaxiesFaker.fake({ planetsIds })
    const completedPlanetsIds = IdsList.create([...planetsIds, Id.create().value])

    expect(galaxy.countCompletedPlanets(completedPlanetsIds).value).toBe(2)
  })

  it('should convert back to the same dto', () => {
    const dto = GalaxiesFaker.fakeDto()

    const galaxy = GalaxiesFaker.fake(dto)

    expect(galaxy.dto).toEqual(dto)
  })
})
