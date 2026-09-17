import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class ChallengeRoadmapNotFoundError extends NotFoundError {
  constructor() {
    super('Roadmap de desafios publicado não encontrado')
  }
}
