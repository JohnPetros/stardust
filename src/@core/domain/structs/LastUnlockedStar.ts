import { BaseStruct } from '../abstracts'
import type { LastUnlockedStarViewPortPosition } from '../types'

type lastUnlockedStarProp = {
  height: number
  yPosition?: number
  viewPortPosition?: LastUnlockedStarViewPortPosition
}

export class LastUnlockedStar extends BaseStruct<lastUnlockedStarProp> {
  readonly height: number
  readonly yPosition: number
  readonly viewPortPosition: LastUnlockedStarViewPortPosition

  private constructor(props: lastUnlockedStarProp) {
    super(props)
    this.height = props.height
    this.yPosition = props.yPosition ?? 0
    this.viewPortPosition = props.viewPortPosition ?? 'above'
  }

  static create(props: lastUnlockedStarProp): LastUnlockedStar {
    return new LastUnlockedStar(props)
  }
}
