import type { StarRewardingPayloadDto } from '#lesson/dtos'
import type {
  ChallengeRewardingPayloadDto,
  StarChallengeRewardingPayloadDto,
} from '#challenging/dtos'

export type RewardingPayloadDto =
  | StarRewardingPayloadDto
  | StarChallengeRewardingPayloadDto
  | ChallengeRewardingPayloadDto
