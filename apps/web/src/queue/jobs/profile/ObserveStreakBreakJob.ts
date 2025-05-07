import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export const ObserveStreakBreakJob = (service: ProfileService): Job => {
  return {
    async handle(queue: Amqp) {
      const useCase = new ObserveStreakBreakUseCase(service)
      await queue.run(async () => useCase.do(), ObserveStreakBreakUseCase.name)
    },
  }
}
