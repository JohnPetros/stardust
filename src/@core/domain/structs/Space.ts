import type { UnlockableItem } from './UnlockableItem'
import type { Planet, Star } from '../entities'
import { BaseStruct } from '../abstracts'

type SpaceProps = {
  planets: Planet[]
  unlockableStars: UnlockableItem<Star>[]
  lastUnlockedStarId: string
}

export class Space extends BaseStruct<SpaceProps> {
  readonly planets: Planet[]
  readonly unlockableStars: UnlockableItem<Star>[]
  readonly lastUnlockedStarId: string

  private constructor(props: SpaceProps) {
    super(props)
    this.planets = props.planets
    this.unlockableStars = props.unlockableStars
    this.lastUnlockedStarId = props.lastUnlockedStarId
  }

  static create(props: SpaceProps) {
    return new Space({
      planets: props.planets,
      unlockableStars: props.unlockableStars,
      lastUnlockedStarId: props.lastUnlockedStarId,
    })
  }

  getUnlockableStarsByPlanet(planetId: string) {
    return this.unlockableStars.filter(({ item: star }) => star.planetId === planetId)
  }
}
