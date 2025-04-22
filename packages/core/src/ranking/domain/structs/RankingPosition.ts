import { OrdinalNumber } from '#global/structs'
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

  getReward(rankingReward: number) {
    return rankingReward + RANKING.baseReward * this.rewardMultiplicator
  }

  isInDangerArea(lastPositionsOffset: number): boolean {
    return this.position.value > lastPositionsOffset
  }

  isLosersPositionOffset(losersPositionsOffset: number): boolean {
    return this.position.value === losersPositionsOffset
  }

  get isInPodiumArea(): boolean {
    return this.position.value <= 3
  }

  get isInWinningArea(): boolean {
    return this.position.value <= 5
  }

  get isWinnersPositionOffset() {
    return this.position.value === 5
  }

  private get rewardMultiplicator() {
    switch (this.position.value) {
      case 1:
        return 3
      case 2:
        return 2
      case 3:
        return 1
      default:
        return this.position.value
    }
  }
}
