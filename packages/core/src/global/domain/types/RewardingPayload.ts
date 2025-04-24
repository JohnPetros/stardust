import type {
  ChallengeRewardingPayload,
  StarChallengeRewardingPayload,
} from '../../../challenging/domain/types'
import type { StarRewardingPayload } from '../../../space/domain/types'

export type RewardingPayload =
  | StarRewardingPayload
  | StarChallengeRewardingPayload
  | ChallengeRewardingPayload
