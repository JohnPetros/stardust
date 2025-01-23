import type { IJob, IQueue, IProfileService } from '@stardust/core/interfaces'

export const ResetWeekStatusJob = (profileService: IProfileService): IJob => {
  return {
    async handle(queue: IQueue) {
      await queue.run(async () => {
        const response = await profileService.resetWeekStatus()
        if (response.isFailure) response.throwError()
      }, 'reset week status service')
    },
  }
}
