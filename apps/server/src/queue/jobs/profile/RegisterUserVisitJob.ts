import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { UserSignedInEvent } from '@stardust/core/auth/events'
import { RegisterUserVisitUseCase } from '@stardust/core/profile/use-cases'

type Payload = EventPayload<typeof UserSignedInEvent>

export class RegisterUserVisitJob implements Job<Payload> {
  static readonly KEY = 'profile/register.user.visit.job'

  constructor(private readonly repository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    const useCase = new RegisterUserVisitUseCase(this.repository)
    await amqp.run(
      async () =>
        await useCase.execute({
          userId: payload.userId,
          platform: payload.platform,
        }),
      RegisterUserVisitUseCase.name,
    )
  }
}
