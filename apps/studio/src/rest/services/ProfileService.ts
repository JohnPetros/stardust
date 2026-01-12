import type { ProfileService as IProfileService } from '@stardust/core/profile/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type {
  Email,
  Id,
  Integer,
  Name,
  Slug,
  InsigniaRole,
} from '@stardust/core/global/structures'
import type { User, Achievement } from '@stardust/core/profile/entities'
import type {
  StarRewardingPayload,
  StarChallengeRewardingPayload,
  ChallengeRewardingPayload,
  UsersListingParams,
} from '@stardust/core/profile/types'
import type { AvatarAggregate, RocketAggregate } from '@stardust/core/profile/aggregates'
import { Datetime } from '@stardust/core/global/libs'

export const ProfileService = (restClient: RestClient): IProfileService => {
  return {
    async fetchAchievements() {
      return await restClient.get('/profile/achievements')
    },

    async fetchUserById(userId: Id) {
      return await restClient.get(`/profile/users/id/${userId.value}`)
    },

    async fetchUserBySlug(userSlug: Slug) {
      return await restClient.get(`/profile/users/slug/${userSlug.value}`)
    },

    async fetchUnlockedAchievements(userId: Id) {
      return await restClient.get(`/profile/achievements/${userId.value}`)
    },

    async fetchCreatedUsersKpi() {
      return await restClient.get('/profile/users/created-users-kpi')
    },

    async fetchUnlockedStarsKpi() {
      return await restClient.get('/profile/users/unlocked-stars-kpi')
    },

    async fetchCompletedChallengesKpi() {
      return await restClient.get('/profile/users/completed-challenges-kpi')
    },

    async fetchDailyActiveUsersReport(days: Integer) {
      return await restClient.get(
        `/profile/users/daily-active-users-report?days=${days.value}`,
      )
    },

    async updateUser(user: User) {
      return await restClient.put(`/profile/users/${user.id.value}`, user.dto)
    },

    async rewardUserForStarCompletion(
      userId: Id,
      rewardingPayload: StarRewardingPayload,
    ) {
      return await restClient.put(
        `/profile/users/${userId.value}/reward/star`,
        rewardingPayload,
      )
    },

    async rewardUserForStarChallengeCompletion(
      userId: Id,
      rewardingPayload: StarChallengeRewardingPayload,
    ) {
      return await restClient.put(
        `/profile/users/${userId.value}/reward/star-challenge`,
        rewardingPayload,
      )
    },

    async rewardUserForChallengeCompletion(
      userId: Id,
      rewardingPayload: ChallengeRewardingPayload,
    ) {
      return await restClient.put(
        `/profile/users/${userId.value}/reward/challenge`,
        rewardingPayload,
      )
    },

    async observeNewUnlockedAchievements(userId: Id) {
      return await restClient.post(`/profile/achievements/${userId.value}/observe`)
    },

    async rescueAchievement(achievementId: Id, userId: Id) {
      return await restClient.put(
        `/profile/achievements/${userId.value}/${achievementId.value}/rescue`,
      )
    },

    async upvoteComment(commentId: Id) {
      return await restClient.post(`/profile/users/comments/${commentId.value}/upvote`)
    },

    async verifyUserNameInUse(userName: Name) {
      return await restClient.get(
        `/profile/users/verify-name-in-use?name=${userName.value}`,
      )
    },

    async verifyUserEmailInUse(userEmail: Email) {
      return await restClient.get(
        `/profile/users/verify-email-in-use?email=${userEmail.value}`,
      )
    },

    async acquireRocket(rocket: RocketAggregate, rocketPrice: Integer) {
      return await restClient.post('/profile/users/rockets/acquire', {
        rocketId: rocket.id.value,
        rocketName: rocket.name.value,
        rocketImage: rocket.image.value,
        rocketPrice: rocketPrice.value,
      })
    },

    async acquireAvatar(avatar: AvatarAggregate, avatarPrice: Integer) {
      return await restClient.post('/profile/users/avatars/acquire', {
        avatarId: avatar.id.value,
        avatarName: avatar.name.value,
        avatarImage: avatar.image.value,
        avatarPrice: avatarPrice.value,
      })
    },

    async acquireInsignia(insigniaRole: InsigniaRole, insigniaPrice: Integer) {
      return await restClient.post('/profile/users/insignias/acquire', {
        insigniaRole: insigniaRole.value,
        insigniaPrice: insigniaPrice.value,
      })
    },

    async fetchUsersList(params: UsersListingParams) {
      restClient.clearQueryParams()
      restClient.setQueryParam('search', params.search?.value ?? '')
      restClient.setQueryParam('page', String(params.page?.value))
      restClient.setQueryParam('itemsPerPage', String(params.itemsPerPage?.value))
      restClient.setQueryParam('levelSorter', params.levelSorter.value)
      restClient.setQueryParam('weeklyXpSorter', params.weeklyXpSorter.value)
      restClient.setQueryParam(
        'unlockedStarCountSorter',
        params.unlockedStarCountSorter.value,
      )
      restClient.setQueryParam(
        'unlockedAchievementCountSorter',
        params.unlockedAchievementCountSorter.value,
      )
      restClient.setQueryParam(
        'completedChallengeCountSorter',
        params.completedChallengeCountSorter.value,
      )
      restClient.setQueryParam(
        'spaceCompletionStatus',
        params.spaceCompletionStatus.value,
      )
      restClient.setQueryParam(
        'insigniaRoles',
        params.insigniaRoles.map((role) => role.value),
      )
      if (params.creationPeriod?.startDate) {
        restClient.setQueryParam(
          'createdAtStartDate',
          new Datetime(params.creationPeriod.startDate).format('YYYY-MM-DD'),
        )
      }
      if (params.creationPeriod?.endDate) {
        restClient.setQueryParam(
          'createdAtEndDate',
          new Datetime(params.creationPeriod.endDate).format('YYYY-MM-DD'),
        )
      }
      return await restClient.get('/profile/users')
    },

    async fetchAllAchievements() {
      return await restClient.get('/profile/achievements')
    },

    async createAchievement(achievement: Achievement) {
      return await restClient.post('/profile/achievements', achievement.dto)
    },

    async updateAchievement(achievement: Achievement) {
      return await restClient.put(
        `/profile/achievements/${achievement.id.value}`,
        achievement.dto,
      )
    },

    async deleteAchievement(achievementId: Id) {
      return await restClient.delete(`/profile/achievements/${achievementId.value}`)
    },

    async reorderAchievements(achievementIds: Id[]) {
      return await restClient.patch('/profile/achievements/order', {
        achievementIds: achievementIds.map((id) => id.value),
      })
    },
  }
}
