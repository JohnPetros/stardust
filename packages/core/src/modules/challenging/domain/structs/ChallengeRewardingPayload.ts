import { ChallengeDifficulty } from '#challenging/structs'
import { Id, Integer, List } from '#global/structs'
import { RewardingPayload } from '#lesson/abstracts'
import type { RewardingPayloadDto } from '#lesson/dtos'
import type { RewardingPayloadOrigin } from '#lesson/types'
import type { ChallengeRewardingPayloadDto } from '#challenging/dtos'

type ChallengeRewardingPayloadProps = {
  origin: RewardingPayloadOrigin
  incorrectAnswersCount: Integer
  secondsCount: Integer
  challengeId: Id
  challengeDifficulty: ChallengeDifficulty
}

export class ChallengeRewardingPayload extends RewardingPayload {
  readonly incorrectAnswersCount: Integer
  readonly secondsCount: Integer
  readonly challengeId: Id
  readonly challengeDifficulty: ChallengeDifficulty

  private constructor(props: ChallengeRewardingPayloadProps) {
    super(props.origin, props.secondsCount)
    this.incorrectAnswersCount = props.incorrectAnswersCount
    this.secondsCount = props.secondsCount
    this.challengeId = props.challengeId
    this.challengeDifficulty = props.challengeDifficulty
  }

  static create(dto: ChallengeRewardingPayloadDto): ChallengeRewardingPayload {
    return new ChallengeRewardingPayload({
      origin: 'star',
      incorrectAnswersCount: Integer.create(
        'Star rewarding payload incorrect answers count',
        dto.incorrectAnswersCount,
      ),
      secondsCount: Integer.create(
        'Star rewarding payload seconds count',
        dto.secondsCount,
      ),
      challengeId: Id.create(dto.challengeId),
      challengeDifficulty: ChallengeDifficulty.create(dto.challengeDifficultyLevel),
    })
  }

  static canBeCreatedBy(
    rewardingPayloadDto: RewardingPayloadDto,
  ): rewardingPayloadDto is ChallengeRewardingPayloadDto {
    const challengeRewardingPayloadDtoKeys = List.create([
      'origin',
      'incorrectAnswersCount',
      'secondsCount',
      'starId',
      'challengeId',
      'challengeDifficulty',
    ])
    const rewardingPayloadDtoKeys = List.create(Object.keys(rewardingPayloadDto))

    return (
      rewardingPayloadDto.origin === 'challenge' &&
      challengeRewardingPayloadDtoKeys.includesList(rewardingPayloadDtoKeys).isTrue
    )
  }
}
