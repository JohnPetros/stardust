import type { IJob, IQueue, IProfileService } from '@stardust/core/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export const ObserveStreakBreakJob = (profileService: IProfileService): IJob => {
  return {
    async handle(queue: IQueue) {
      const useCase = new ObserveStreakBreakUseCase(profileService)
      await queue.run(useCase.do, ObserveStreakBreakUseCase.name)
    },
  }
}
