import type { UserDto } from '@stardust/core/global/dtos'
import type { AchievementDto } from '@stardust/core/profile/dtos'
import { ObserveNewUnlockedAchievementsUseCase } from '@stardust/core/profile/use-cases'
import type {
  IAction,
  IActionServer,
  IProfileService,
} from '@stardust/core/global/interfaces'

type Response = {
  userDto: UserDto
  newUnlockedAchievementsDto: AchievementDto[]
}

export const ObsverNewUnlockedAchievementsAction = (
  profileService: IProfileService,
): IAction<void, Response> => {
  return {
    async handle(actionServer: IActionServer) {
      const userDto = await actionServer.getUser()
      const useCase = new ObserveNewUnlockedAchievementsUseCase(profileService)
      const { user, newUnlockedAchievements } = await useCase.do({
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
