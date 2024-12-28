import { ChallengeDifficulty } from '#challenging/structs'
import { Id, Integer, List } from '#global/structs'
import { RewardingPayload } from '#lesson/abstracts'
import type { RewardingPayloadDto } from '#lesson/dtos'
import type { RewardingPayloadOrigin } from '#lesson/types'
import type { StarChallengeRewardingPayloadDto } from '#challenging/dtos'

type StarChallengeRewardingPayloadProps = {
  origin: RewardingPayloadOrigin
  incorrectAnswersCount: Integer
  secondsCount: Integer
  starId: Id
  challengeId: Id
  challengeDifficulty: ChallengeDifficulty
}

export class StarChallengeRewardingPayload extends RewardingPayload {
  readonly incorrectAnswersCount: Integer
  readonly secondsCount: Integer
  readonly starId: Id
  readonly challengeId: Id
  readonly challengeDifficulty: ChallengeDifficulty

  private constructor(props: StarChallengeRewardingPayloadProps) {
    super(props.origin, props.secondsCount)
    this.incorrectAnswersCount = props.incorrectAnswersCount
    this.secondsCount = props.secondsCount
    this.starId = props.starId
    this.challengeId = props.challengeId
    this.challengeDifficulty = props.challengeDifficulty
  }

  static create(dto: StarChallengeRewardingPayloadDto): StarChallengeRewardingPayload {
    return new StarChallengeRewardingPayload({
      origin: 'star',
      incorrectAnswersCount: Integer.create(
        'Star rewarding payload incorrect answers count',
        dto.incorrectAnswersCount,
      ),
      secondsCount: Integer.create(
        'Star rewarding payload seconds count',
        dto.secondsCount,
      ),
      starId: Id.create(dto.starId),
      challengeId: Id.create(dto.challengeId),
      challengeDifficulty: ChallengeDifficulty.create(dto.challengeDifficultyLevel),
    })
  }

  static canBeCreatedBy(
    rewardingPayloadDto: RewardingPayloadDto,
  ): rewardingPayloadDto is StarChallengeRewardingPayloadDto {
    const starChallengeRewardingPayloadDtoKeys = List.create([
      'origin',
      'incorrectAnswersCount',
      'secondsCount',
      'starId',
      'challengeId',
      'challengeDifficulty',
    ])
    const rewardingPayloadDtoKeys = List.create(Object.keys(rewardingPayloadDto))

    return (
      rewardingPayloadDto.origin === 'star' &&
      starChallengeRewardingPayloadDtoKeys.includesList(rewardingPayloadDtoKeys).isTrue
    )
  }
}
