import { Integer, Logical, OrdinalNumber } from '../../../global/domain/structures'
import { RANKING } from '../constants'

export class RankingPosition {
  readonly position: OrdinalNumber

  private constructor(position: OrdinalNumber) {
    this.position = position
  }

  static create(positionValue: number) {
    return new RankingPosition(
      OrdinalNumber.create(positionValue, 'ranking position value'),
    )
  }

  getReward(rankingReward: Integer) {
    const baseReward = Integer.create(RANKING.baseReward)
    return this.rewardMultiplicator.multiply(baseReward).plus(rankingReward)
  }

  isInDangerArea(lastPositionsOffset: number): Logical {
    return Logical.create(this.position.value > lastPositionsOffset)
  }

  isLosersPositionOffset(losersPositionsOffset: number): Logical {
    return Logical.create(this.position.value === losersPositionsOffset)
  }

  get isInPodiumArea(): Logical {
    return Logical.create(this.position.value <= 3)
  }

  get isInWinningArea(): Logical {
    return Logical.create(this.position.value <= 5)
  }

  get isWinnersPositionOffset() {
    return Logical.create(this.position.value === 5)
  }

  get value(): number {
    return this.position.value
  }

  private get rewardMultiplicator() {
    switch (this.position.value) {
      case 1:
        return Integer.create(3)
      case 2:
        return Integer.create(2)
      case 3:
        return Integer.create(1)
      default:
        return Integer.create(this.position.value)
    }
  }
}
