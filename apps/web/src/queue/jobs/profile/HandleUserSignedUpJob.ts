import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { IJob, IProfileService, IQueue } from '@stardust/core/interfaces'

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export const HandleUserSignedUpJob = (profileService: IProfileService): IJob<Payload> => {
  return {
    key: 'profile/handle.user.signed.up',
    eventName: UserSignedUpEvent.name,
    async handle(queue: IQueue<Payload>) {},
  }
}
