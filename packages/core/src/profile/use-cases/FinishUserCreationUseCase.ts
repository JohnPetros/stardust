import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserCreatedEvent } from '../domain/events'

type Request = {
  userId: string
  userName: string
  userEmail: string
  userSlug: string
}

type Response = Promise<void>

export class FinishUserCreationUseCase implements UseCase<Request, Response> {
  constructor(private readonly broker: Broker) {}

  async execute({ userId, userName, userEmail, userSlug }: Request): Response {
    const event = new UserCreatedEvent({
      userId,
      userName,
      userEmail,
      userSlug,
    })
    await this.broker.publish(event)
  }
}
