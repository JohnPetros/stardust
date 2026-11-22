import type { Id } from '#global/domain/structures/Id'
import { Integer } from '#global/domain/structures/Integer'
import { Logical } from '#global/domain/structures/Logical'
import { IdsList } from '#global/domain/structures/IdsList'
import type { Planet, Star } from '../entities'
import { PlanetProgressState } from './PlanetProgressState'
import { StarProgressState } from './StarProgressState'

export type GalaxyTrailCurrentItem =
  | { kind: 'star'; starId: Id }
  | { kind: 'planet'; planetId: Id }
  | null

type GalaxyTrailProps = {
  planets: Planet[]
  completedStarsIds: IdsList
  openedPlanetsIds: IdsList
}

export class GalaxyTrail {
  private constructor(
    readonly planets: Planet[],
    readonly completedStarsIds: IdsList,
    readonly openedPlanetsIds: IdsList,
  ) {}

  static create({
    planets,
    completedStarsIds,
    openedPlanetsIds,
  }: GalaxyTrailProps): GalaxyTrail {
    const orderedPlanets = [...planets].sort(
      (a, b) => a.position.value - b.position.value,
    )
    return new GalaxyTrail(orderedPlanets, completedStarsIds, openedPlanetsIds)
  }

  getPlanetState(planetId: Id): PlanetProgressState {
    if (this.openedPlanetsIds.includes(planetId).isTrue) {
      return PlanetProgressState.create('opened')
    }
    const index = this.planets.findIndex((planet) => planet.id.value === planetId.value)
    if (index <= 0)
      return PlanetProgressState.create(index === 0 ? 'liberated' : 'locked')
    const previousPlanet = this.planets[index - 1]
    return PlanetProgressState.create(
      this.isPlanetCompleted(previousPlanet.id).isTrue ? 'liberated' : 'locked',
    )
  }

  getStarState(starId: Id): StarProgressState {
    if (this.completedStarsIds.includes(starId).isTrue) {
      return StarProgressState.create('completed')
    }
    const planet = this.planets.find((planet) =>
      planet.stars.some((star) => star.id.value === starId.value),
    )
    if (!planet || this.getPlanetState(planet.id).isOpened.isFalse) {
      return StarProgressState.create('locked')
    }
    const index = planet.stars.findIndex((star) => star.id.value === starId.value)
    const isAvailable =
      index === 0 || this.completedStarsIds.includes(planet.stars[index - 1].id).isTrue
    return StarProgressState.create(isAvailable ? 'available' : 'locked')
  }

  canAccessStar(starId: Id): Logical {
    return this.getStarState(starId).isAccessible
  }

  canOpenPlanet(planetId: Id): Logical {
    return this.getPlanetState(planetId).isLiberated
  }

  isPlanetCompleted(planetId: Id): Logical {
    const planet = this.planets.find((planet) => planet.id.value === planetId.value)
    if (!planet || planet.stars.length === 0) return Logical.create(false)
    return Logical.create(
      planet.stars.every((star) => this.completedStarsIds.includes(star.id).isTrue),
    )
  }

  countCompletedStars(planetId: Id): Integer {
    const planet = this.planets.find((planet) => planet.id.value === planetId.value)
    if (!planet) return Integer.create(0)
    return Integer.create(
      planet.stars.filter((star) => this.completedStarsIds.includes(star.id).isTrue)
        .length,
    )
  }

  get completedPlanetsIds(): IdsList {
    return IdsList.create(
      this.planets
        .filter((planet) => this.isPlanetCompleted(planet.id).isTrue)
        .map((planet) => planet.id.value),
    )
  }

  get currentItem(): GalaxyTrailCurrentItem {
    for (const planet of this.planets) {
      const pendingStar = planet.stars.find(
        (star) => this.completedStarsIds.includes(star.id).isFalse,
      )
      if (!pendingStar) continue
      if (this.getPlanetState(planet.id).isOpened.isFalse) {
        return { kind: 'planet', planetId: planet.id }
      }
      return { kind: 'star', starId: pendingStar.id }
    }
    return null
  }

  get isCompleted(): Logical {
    const stars = this.stars
    if (stars.length === 0) return Logical.create(false)
    return Logical.create(
      stars.every((star) => this.completedStarsIds.includes(star.id).isTrue),
    )
  }

  isLastStar(starId: Id): Logical {
    const stars = this.stars
    const lastStar = stars[stars.length - 1]
    return Logical.create(lastStar?.id.value === starId.value)
  }

  isLastStarOfPlanet(starId: Id): Logical {
    const planet = this.planets.find((planet) =>
      planet.stars.some((star) => star.id.value === starId.value),
    )
    const lastStar = planet?.stars[planet.stars.length - 1]
    return Logical.create(lastStar?.id.value === starId.value)
  }

  private get stars(): Star[] {
    return this.planets.flatMap((planet) => planet.stars)
  }
}
