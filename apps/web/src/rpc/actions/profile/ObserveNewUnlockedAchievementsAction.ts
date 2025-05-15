import type { Call, Action } from '@stardust/core/global/interfaces'
import type { AchievementDto, UserDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { ObserveNewUnlockedAchievementsUseCase } from '@stardust/core/profile/use-cases'

type Response = {
  userDto: UserDto
  newUnlockedAchievementsDto: AchievementDto[]
}

export const ObsverNewUnlockedAchievementsAction = (
  profileService: ProfileService,
): Action<void, Response> => {
  return {
    async handle(call: Call) {
      const userDto = await call.getUser()
      const useCase = new ObserveNewUnlockedAchievementsUseCase(profileService)
      const { user, newUnlockedAchievements } = await useCase.execute({
        userDto,
      })

      return {
        userDto: user.dto,
        newUnlockedAchievementsDto: newUnlockedAchievements.map(
          (achievement) => achievement.dto,
        ),
      }
    },
  }
}
