import type { UnlockableItem } from './UnlockableItem'
import type { Planet, Star } from '../entities'

type SpaceProps = {
  planets: Planet[]
  unlockableStars: UnlockableItem<Star>[]
  lastUnlockedStarId: string
}

export class Space extends BaseStruct<SpaceProps> {
  readonly planets: Planet[]
  readonly stars: UnlockableItem<Star>[]
  readonly lastUnlockedStarId: string

  private constructor(props: SpaceProps) {
    super(props)
    this.planets = props.planets
    this.stars = props.unlockableStars
    this.lastUnlockedStarId = props.lastUnlockedStarId
  }

  static create(props: SpaceProps) {
    return new Space({
      planets: props.planets,
      unlockableStars: props.unlockableStars,
      lastUnlockedStarId: props.lastUnlockedStarId,
    })
  }
}
