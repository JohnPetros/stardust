import type { IJob, IProfileService } from '@stardust/core/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export const ObserveStreakBreakJob = (profileService: IProfileService): IJob => {
  return {
    key: 'profile/observe.streak.break',
    async handle() {
      const useCase = new ObserveStreakBreakUseCase(profileService)
      await useCase.do()
    },
  }
}
