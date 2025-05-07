import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'

export const ResetWeekStatusJob = (service: ProfileService): Job => {
  return {
    async handle(queue: Amqp) {
      await queue.run(async () => {
        const response = await service.resetWeekStatus()
        if (response.isFailure) response.throwError()
      }, 'reset week status service')
    },
  }
}
