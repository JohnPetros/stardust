import type { IJob, IQueue, IProfileService } from '@stardust/core/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export const KEY = 'profile/observe.streak.break'

export const ObserveStreakBreakJob = (profileService: IProfileService): IJob => {
  return {
    key: KEY,
    async handle(queue: IQueue) {
      const useCase = new ObserveStreakBreakUseCase(profileService)
      await queue.run(async () => await useCase.do(), ObserveStreakBreakUseCase.name)
    },
  }
}
