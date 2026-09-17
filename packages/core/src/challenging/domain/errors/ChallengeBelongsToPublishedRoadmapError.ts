import { ConflictError } from '#global/domain/errors/ConflictError'

export class ChallengeBelongsToPublishedRoadmapError extends ConflictError {
  constructor() {
    super(
      'Este desafio pertence ao roadmap publicado. Crie e publique uma nova revisão sem ele antes de alterá-lo',
    )
  }
}
