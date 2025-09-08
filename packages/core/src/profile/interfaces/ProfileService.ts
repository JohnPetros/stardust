import type { RestResponse } from '#global/responses/index'
import type { Email, Id, Integer, Name, Slug } from '#global/domain/structures/index'
import type { AchievementDto, UserDto } from '../domain/entities/dtos'
import type { User } from '../domain/entities'
import type {
  StarChallengeRewardingPayload,
  StarRewardingPayload,
  ChallengeRewardingPayload,
} from '../domain/types'
import type { WeekStatusValue } from '../domain/types'
import type { AvatarAggregate, RocketAggregate } from '../domain/aggregates'

type RewardingResponse = {
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
  newCoins: number
  newXp: number
  accuracyPercentage: number
}

export interface ProfileService {
  fetchUserById(userId: Id): Promise<RestResponse<UserDto>>
  fetchUserBySlug(userSlug: Slug): Promise<RestResponse<UserDto>>
  fetchAchievements(): Promise<RestResponse<AchievementDto[]>>
  fetchUnlockedAchievements(userId: Id): Promise<RestResponse<AchievementDto[]>>
  observeNewUnlockedAchievements(userId: Id): Promise<RestResponse<AchievementDto[]>>
  rescueAchievement(achievementId: Id, userId: Id): Promise<RestResponse<UserDto>>
  updateUser(user: User): Promise<RestResponse<UserDto>>
  upvoteComment(
    commentId: Id,
  ): Promise<RestResponse<{ userUpvotedCommentsIds: string[] }>>
  verifyUserNameInUse(userName: Name): Promise<RestResponse>
  verifyUserEmailInUse(userEmail: Email): Promise<RestResponse>
  rewardUserForStarCompletion(
    userId: Id,
    rewardsPayload: StarRewardingPayload,
  ): Promise<RestResponse<RewardingResponse>>
  rewardUserForStarChallengeCompletion(
    userId: Id,
    rewardingPayload: StarChallengeRewardingPayload,
  ): Promise<RestResponse<RewardingResponse>>
  rewardUserForChallengeCompletion(
    userId: Id,
    rewardingPayload: ChallengeRewardingPayload,
  ): Promise<RestResponse<RewardingResponse>>
  acquireRocket(
    rocket: RocketAggregate,
    rocketPrice: Integer,
  ): Promise<RestResponse<UserDto>>
  acquireAvatar(
    avatar: AvatarAggregate,
    avatarPrice: Integer,
  ): Promise<RestResponse<UserDto>>
}
