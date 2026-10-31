import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { UiProvider } from '@stardust/core/ui/interfaces'
import { Id } from '@stardust/core/global/structures'
import { Achievement } from '@stardust/core/profile/entities'
import type { SortableItem } from '@/ui/global/widgets/components/SortableGrid/types'

type Params = {
  achievementsDto: AchievementDto[]
  profileService: ProfileService
  toastProvider: ToastProvider
  uiProvider: UiProvider
}

type AchievementFormData = {
  name: string
  icon: string
  description: string
  reward: number
  requiredCount: number
  metric: string
}

export function useAchievementsPage({
  achievementsDto,
  profileService,
  toastProvider,
  uiProvider,
}: Params) {
  async function handleCreateAchievement(data: AchievementFormData) {
    const position = achievementsDto.length + 1

    const achievement = Achievement.create({
      name: data.name,
      icon: data.icon,
      description: data.description,
      reward: data.reward,
      requiredCount: data.requiredCount,
      position,
      metric: data.metric,
    })

    const response = await profileService.createAchievement(achievement)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      uiProvider.reload()
    }
  }

  async function handleUpdate(achievement: AchievementDto, data: AchievementFormData) {
    const updatedAchievement = Achievement.create({
      name: data.name,
      icon: data.icon,
      description: data.description,
      reward: data.reward,
      requiredCount: data.requiredCount,
      position: achievement.position,
      metric: data.metric,
      id: achievement.id,
    })

    const response = await profileService.updateAchievement(updatedAchievement)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      uiProvider.reload()
    }
  }

  async function handleDelete(achievement: AchievementDto) {
    const achievementId = Id.create(achievement.id)
    const response = await profileService.deleteAchievement(achievementId)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      uiProvider.reload()
    }
  }

  async function handleDragEnd(achievements: SortableItem<AchievementDto>[]) {
    const achievementIds = achievements
      .map((achievement) => {
        if (!achievement.data.id) return null
        return Id.create(achievement.data.id)
      })
      .filter((id): id is Id => id !== null)
    const response = await profileService.reorderAchievements(achievementIds)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      uiProvider.reload()
    }
  }

  const achievements = achievementsDto
    .filter((achievement) => achievement.id !== undefined)
    .map((achievement) => ({
      id: achievement.id as string,
      data: achievement,
    }))

  return {
    achievements,
    handleCreateAchievement,
    handleUpdate,
    handleDelete,
    handleDragEnd,
  }
}
