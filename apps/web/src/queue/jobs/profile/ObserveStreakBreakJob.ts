import type { IJob, IQueue, IProfileService } from '@stardust/core/global/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export const ObserveStreakBreakJob = (service: IProfileService): IJob => {
  return {
    async handle(queue: IQueue) {
      const useCase = new ObserveStreakBreakUseCase(service)
      await queue.run(async () => useCase.do(), ObserveStreakBreakUseCase.name)
    },
  }
}
