import type { RewardingPayloadDto, StarRewardingPayloadDto } from '#dtos'
import type { RewardingPayloadOrigin } from '../../types'
import { RewardingPayload } from '#domain/abstracts'
import { Id } from '../global/Id'
import { Integer } from '../global/Integer'
import { List } from '../global/List'

type RewardingPayloadProps = {
  origin: RewardingPayloadOrigin
  incorrectAnswersCount: Integer
  questionsCount: Integer
  secondsCount: Integer
  starId: Id
}

export class StarRewardingPayload extends RewardingPayload {
  readonly incorrectAnswersCount: Integer
  readonly questionsCount: Integer
  readonly secondsCount: Integer
  readonly starId: Id

  private constructor(props: RewardingPayloadProps) {
    super(props.origin, props.secondsCount)
    this.incorrectAnswersCount = props.incorrectAnswersCount
    this.questionsCount = props.questionsCount
    this.secondsCount = props.secondsCount
    this.starId = props.starId
  }

  static create(dto: StarRewardingPayloadDto): StarRewardingPayload {
    return new StarRewardingPayload({
      origin: 'star',
      questionsCount: Integer.create(
        'Star rewarding payload questions count',
        dto.questionsCount,
      ),
      incorrectAnswersCount: Integer.create(
        'Star rewarding payload incorrect answers count',
        dto.incorrectAnswersCount,
      ),
      secondsCount: Integer.create(
        'Star rewarding payload seconds count',
        dto.secondsCount,
      ),
      starId: Id.create(dto.starId),
    })
  }

  static canBeCreatedBy(
    rewardingPayloadDto: RewardingPayloadDto,
  ): rewardingPayloadDto is StarRewardingPayloadDto {
    const starRewardingPayloadDtoKeys = List.create([
      'origin',
      'incorrectAnswersCount',
      'questionsCount',
      'secondsCount',
      'starId',
    ])
    const rewardingPayloadDtoKeys = List.create(Object.keys(rewardingPayloadDto))

    // console.log(starRewardingPayloadDtoKeys.includesList(rewardingPayloadDtoKeys).value)

    return (
      rewardingPayloadDto.origin === 'star' &&
      starRewardingPayloadDtoKeys.includesList(rewardingPayloadDtoKeys).isTrue
    )
  }
}
