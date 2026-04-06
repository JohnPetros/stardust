import type { ChallengesCompletionDto } from './dtos'

type Props = {
  completedChallengesCount: number | null
  totalChallengesCount: number
}

export class ChallengesCompletion {
  private constructor(
    readonly completedChallengesCount: number | null,
    readonly totalChallengesCount: number,
  ) {}

  static create(props: Props) {
    return new ChallengesCompletion(
      props.completedChallengesCount,
      props.totalChallengesCount,
    )
  }

  get dto(): ChallengesCompletionDto {
    return {
      completedChallengesCount: this.completedChallengesCount,
      totalChallengesCount: this.totalChallengesCount,
    }
  }
}
