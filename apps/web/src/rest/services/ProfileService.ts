import type { ProfileService as IProfileService } from '@stardust/core/profile/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Email, Id, Integer, Name, Slug } from '@stardust/core/global/structures'
import type { User } from '@stardust/core/profile/entities'
import type {
  StarRewardingPayload,
  StarChallengeRewardingPayload,
  ChallengeRewardingPayload,
} from '@stardust/core/profile/types'
import type { AvatarAggregate, RocketAggregate } from '@stardust/core/profile/aggregates'

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
      return await restClient.get(`/profile/achievements/${userId.value}/unlocked`)
    },

    async updateUser(user: User) {
      return await restClient.put(`/profile/users/${user.id.value}`, user.dto)
    },

    async rewardUserForStarCompletion(userId: Id, rewardsPayload: StarRewardingPayload) {
      return await restClient.put(
        `/profile/users/${userId.value}/reward/star`,
        rewardsPayload,
      )
    },

    async rewardUserForStarChallengeCompletion(
      userId: Id,
      rewardsPayload: StarChallengeRewardingPayload,
    ) {
      return await restClient.put(
        `/profile/users/${userId.value}/reward/star-challenge`,
        rewardsPayload,
      )
    },

    async rewardUserForChallengeCompletion(
      userId: Id,
      rewardsPayload: ChallengeRewardingPayload,
    ) {
      return await restClient.put(
        `/profile/users/${userId.value}/reward/challenge`,
        rewardsPayload,
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

    async verifyUserNameInUse(userName: Name) {
      return await restClient.get(
        `/profile/users/verify-user-name-in-use?name=${userName.value}`,
      )
    },

    async verifyUserEmailInUse(userEmail: Email) {
      return await restClient.get(
        `/profile/users/verify-user-email-in-use?email=${userEmail.value}`,
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
  }
}
