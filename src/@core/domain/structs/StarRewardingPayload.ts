import type { RewardingPayloadDTO, StarRewardingPayloadDTO } from '@/@core/dtos'
import type { RewardingPayloadOrigin } from '../types'
import { RewardingPayload } from '../abstracts'
import { Id } from './Id'
import { Integer } from './Integer'
import { List } from './List'

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

  static create(dto: StarRewardingPayloadDTO): StarRewardingPayload {
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
    rewardingPayloadDTO: RewardingPayloadDTO,
  ): rewardingPayloadDTO is StarRewardingPayloadDTO {
    const starRewardingPayloadDTOKeys = List.create([
      'origin',
      'incorrectAnswersCount',
      'questionsCount',
      'secondsCount',
      'starId',
    ])
    const rewardingPayloadDTOKeys = List.create(Object.keys(rewardingPayloadDTO))

    // console.log(starRewardingPayloadDTOKeys.includesList(rewardingPayloadDTOKeys).value)

    return (
      rewardingPayloadDTO.origin === 'star' &&
      starRewardingPayloadDTOKeys.includesList(rewardingPayloadDTOKeys).isTrue
    )
  }
}
