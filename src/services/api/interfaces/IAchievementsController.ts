import { Achievement } from '@/@types/Achievement'

export interface IAchievementsController {
  getAchievements(): Promise<Achievement[]>
  getUserUnlockedAchievementsIds(userId: string): Promise<string[]>
  getUserRescuableAchievementsIds(userId: string): Promise<string[]>
  addUserUnlockedAchievement(
    achievementId: string,
    userId: string
  ): Promise<void>
  addUserRescuableAchievements(
    achievementId: string,
    userId: string
  ): Promise<void>
  deleteUserRescuebleAchievement(
    achievementId: string,
    userId: string
  ): Promise<void>
}
