import type { ProfileService as IProfileService } from '@stardust/core/profile/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Email, Id, Name, Slug } from '@stardust/core/global/structures'
import type { User } from '@stardust/core/profile/entities'

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

    async observeNewUnlockedAchievements(userId: Id) {
      return await restClient.post(`/profile/achievements/${userId.value}/observe`)
    },

    async rescueAchievement(achievementId: Id, userId: Id) {
      return await restClient.post(`/profile/achievements/${achievementId.value}/rescue`)
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

    async updateUser(user: User) {
      return await restClient.put(`/profile/users/${user.id.value}`, user.dto)
    },
  }
}
