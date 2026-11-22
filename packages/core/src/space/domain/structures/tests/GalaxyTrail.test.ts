import { IdsList } from '#global/domain/structures/IdsList'
import { Id } from '#global/domain/structures/Id'
import { PlanetsFaker, StarsFaker } from '../../entities/tests/fakers'
import type { Planet } from '../../entities'
import { GalaxyTrail } from '../GalaxyTrail'

function fakePlanet(position: number, starsCount: number): Planet {
  return PlanetsFaker.fake({
    position,
    stars: Array.from({ length: starsCount }).map((_, index) =>
      StarsFaker.fakeDto({ number: index + 1 }),
    ),
  })
}

function ids(...values: Id[]): IdsList {
  return IdsList.create(values.map((id) => id.value))
}

describe('GalaxyTrail Structure', () => {
  let planets: Planet[]

  beforeEach(() => {
    planets = [fakePlanet(1, 4), fakePlanet(2, 3), fakePlanet(3, 2)]
  })

  it('should derive a trail without facts', () => {
    const trail = GalaxyTrail.create({
      planets: [planets[2], planets[0], planets[1]],
      completedStarsIds: IdsList.create(),
      openedPlanetsIds: IdsList.create(),
    })

    expect(trail.planets.map((planet) => planet.position.value)).toEqual([1, 2, 3])
    expect(trail.getPlanetState(planets[0].id).value).toBe('liberated')
    expect(trail.getPlanetState(planets[1].id).value).toBe('locked')
    expect(trail.getPlanetState(planets[2].id).value).toBe('locked')
    for (const planet of planets) {
      for (const star of planet.stars) {
        expect(trail.getStarState(star.id).value).toBe('locked')
      }
    }
    expect(trail.currentItem).toEqual({ kind: 'planet', planetId: planets[0].id })
    expect(trail.completedPlanetsIds.isEmpty.isTrue).toBe(true)
    expect(trail.isCompleted.isFalse).toBe(true)
  })

  it('should make only the first star available after the planet is opened', () => {
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: IdsList.create(),
      openedPlanetsIds: ids(planets[0].id),
    })
    const [first, second] = planets[0].stars

    expect(trail.getPlanetState(planets[0].id).value).toBe('opened')
    expect(trail.getStarState(first.id).value).toBe('available')
    expect(trail.getStarState(second.id).value).toBe('locked')
    expect(trail.currentItem).toEqual({ kind: 'star', starId: first.id })
  })

  it('should complete a star and make the next one available', () => {
    const [first, second, third] = planets[0].stars
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: ids(first.id),
      openedPlanetsIds: ids(planets[0].id),
    })

    expect(trail.getStarState(first.id).value).toBe('completed')
    expect(trail.getStarState(second.id).value).toBe('available')
    expect(trail.getStarState(third.id).value).toBe('locked')
    expect(trail.currentItem).toEqual({ kind: 'star', starId: second.id })
    expect(trail.countCompletedStars(planets[0].id).value).toBe(1)
    expect(trail.canAccessStar(first.id).isTrue).toBe(true)
    expect(trail.canAccessStar(second.id).isTrue).toBe(true)
    expect(trail.canAccessStar(third.id).isFalse).toBe(true)
  })

  it('should liberate the next planet when the previous one is completed', () => {
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: ids(...planets[0].stars.map((star) => star.id)),
      openedPlanetsIds: ids(planets[0].id),
    })

    expect(trail.isPlanetCompleted(planets[0].id).isTrue).toBe(true)
    expect(trail.completedPlanetsIds.dto).toEqual([planets[0].id.value])
    expect(trail.getPlanetState(planets[1].id).value).toBe('liberated')
    expect(trail.canOpenPlanet(planets[1].id).isTrue).toBe(true)
    expect(trail.canOpenPlanet(planets[2].id).isFalse).toBe(true)
    for (const star of planets[1].stars) {
      expect(trail.getStarState(star.id).value).toBe('locked')
    }
    expect(trail.currentItem).toEqual({ kind: 'planet', planetId: planets[1].id })
  })

  it('should have no current item and be completed when everything is done', () => {
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: ids(
        ...planets.flatMap((planet) => planet.stars.map((star) => star.id)),
      ),
      openedPlanetsIds: ids(...planets.map((planet) => planet.id)),
    })

    expect(trail.currentItem).toBeNull()
    expect(trail.isCompleted.isTrue).toBe(true)
  })

  it('should not be completed and have no current item for an empty catalog', () => {
    const trail = GalaxyTrail.create({
      planets: [],
      completedStarsIds: IdsList.create(),
      openedPlanetsIds: IdsList.create(),
    })

    expect(trail.currentItem).toBeNull()
    expect(trail.isCompleted.isFalse).toBe(true)
  })

  it('should keep a planet opened when a new star is inserted in it', () => {
    const planet = PlanetsFaker.fake({
      position: 1,
      stars: [1, 2, 3, 4].map((number) => StarsFaker.fakeDto({ number })),
    })
    const [first, newStar, second, third] = [
      planet.stars[0],
      planet.stars[1],
      planet.stars[2],
      planet.stars[3],
    ]
    const trail = GalaxyTrail.create({
      planets: [planet],
      completedStarsIds: ids(first.id, second.id, third.id),
      openedPlanetsIds: ids(planet.id),
    })

    expect(trail.getPlanetState(planet.id).value).toBe('opened')
    expect(trail.getStarState(newStar.id).value).toBe('available')
    expect(trail.getStarState(first.id).value).toBe('completed')
    expect(trail.getStarState(second.id).value).toBe('completed')
    expect(trail.currentItem).toEqual({ kind: 'star', starId: newStar.id })
  })

  it('should identify the last star of the trail and of each planet', () => {
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: IdsList.create(),
      openedPlanetsIds: IdsList.create(),
    })
    const lastOfTrail = planets[2].stars[1]
    const lastOfFirst = planets[0].stars[3]

    expect(trail.isLastStar(lastOfTrail.id).isTrue).toBe(true)
    expect(trail.isLastStar(lastOfFirst.id).isFalse).toBe(true)
    expect(trail.isLastStarOfPlanet(lastOfFirst.id).isTrue).toBe(true)
    expect(trail.isLastStarOfPlanet(planets[0].stars[0].id).isFalse).toBe(true)
  })

  it('should lock an unknown star', () => {
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: IdsList.create(),
      openedPlanetsIds: IdsList.create(),
    })

    expect(trail.getStarState(Id.create()).value).toBe('locked')
  })
})
