import type { Database } from '#global/interfaces/Database'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import { PlanetNotFoundError } from '../domain/errors'
import { FirstStarUnlockedEvent } from '../domain/events'
import type { PlanetsRepository } from '../interfaces'

type Request = {
  userId: string
  userName: string
  userEmail: string
}

type Response = Promise<void>

export class UnlockFirstStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: PlanetsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request) {
    const firstPlanet = await this.findFirstPlanet()

    await this.publishFirstStar(request, firstPlanet.firstStar.id.value)
  }
  private async findFirstPlanet() {
    const planet = await this.repository.findByPosition(OrdinalNumber.create(1))
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }
  private eventUser(request: Request) {
    return { id: request.userId, name: request.userName, email: request.userEmail }
  }
  private publishFirstStar(request: Request, firstUnlockedStarId: string) {
    return this.broker.publish(
      new FirstStarUnlockedEvent({
        user: this.eventUser(request),
        firstUnlockedStarId,
      }),
    )
  }
}
