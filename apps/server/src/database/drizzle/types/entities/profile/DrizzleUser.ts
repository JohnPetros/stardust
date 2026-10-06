import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'
import type { rocketModel } from '../../../models/shop/rocket-model'
import type { tierModel } from '../../../models/ranking/tier-model'
import type { planetModel } from '../../../models/space/planet-model'
import type { insigniaModel } from '../../../models/shop/insignia-model'
import type { userUnlockedStarModel } from '../../../models/profile/user-unlocked-star-model'
import type { userRecentlyUnlockedStarModel } from '../../../models/profile/user-recently-unlocked-star-model'
import type { userUnlockedAchievementModel } from '../../../models/profile/user-unlocked-achievement-model'
import type { userRescuableAchievementModel } from '../../../models/profile/user-rescuable-achievement-model'
import type { userAcquiredRocketModel } from '../../../models/profile/user-acquired-rocket-model'
import type { userAcquiredAvatarModel } from '../../../models/profile/user-acquired-avatar-model'
import type { userCompletedChallengeModel } from '../../../models/profile/user-completed-challenge-model'
import type { userUpvotedSolutionModel } from '../../../models/profile/user-upvoted-solution-model'
import type { userUpvotedCommentModel } from '../../../models/profile/user-upvoted-comment-model'

export type DrizzleUser = typeof userModel.$inferSelect & {
  avatar?: typeof avatarModel.$inferSelect | null
  rocket?: typeof rocketModel.$inferSelect | null
  tier?: typeof tierModel.$inferSelect | null
  insignias?: Pick<typeof insigniaModel.$inferSelect, 'role'>[]
  usersUnlockedStars?: Pick<typeof userUnlockedStarModel.$inferSelect, 'starId'>[]
  usersRecentlyUnlockedStars?: Pick<
    typeof userRecentlyUnlockedStarModel.$inferSelect,
    'starId'
  >[]
  usersUnlockedAchievements?: Pick<
    typeof userUnlockedAchievementModel.$inferSelect,
    'achievementId'
  >[]
  usersRescuableAchievements?: Pick<
    typeof userRescuableAchievementModel.$inferSelect,
    'achievementId'
  >[]
  usersAcquiredRockets?: Pick<typeof userAcquiredRocketModel.$inferSelect, 'rocketId'>[]
  usersAcquiredAvatars?: Pick<typeof userAcquiredAvatarModel.$inferSelect, 'avatarId'>[]
  usersCompletedChallenges?: Pick<
    typeof userCompletedChallengeModel.$inferSelect,
    'challengeId'
  >[]
  usersUpvotedSolutions?: Pick<
    typeof userUpvotedSolutionModel.$inferSelect,
    'solutionId'
  >[]
  usersUpvotedComments?: Pick<typeof userUpvotedCommentModel.$inferSelect, 'commentId'>[]
  usersCompletedPlanets?: { planetId: (typeof planetModel.$inferSelect)['id'] | null }[]
}

export type DrizzleInsertUser = typeof userModel.$inferInsert
