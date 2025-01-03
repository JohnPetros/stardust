import type {
  ChallengeRewardingPayload,
  StarChallengeRewardingPayload,
} from '#challenging/types'
import type { StarRewardingPayload } from '#space/types'

export type RewardingPayload =
  | StarRewardingPayload
  | StarChallengeRewardingPayload
  | ChallengeRewardingPayload
