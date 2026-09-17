import { ChallengeStarAlreadyInUseError } from '#challenging/domain/errors/ChallengeStarAlreadyInUseError'
import {
  ChallengeNotFoundError,
  ChallengeIsAlreadyStarError,
  ChallengeBelongsToPublishedRoadmapError,
} from '#challenging/domain/errors/index'
import type { ChallengeRoadmapsRepository } from '#challenging/interfaces/ChallengeRoadmapsRepository'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'

type Request = {
  challengeId: string
  starId: string
}

type Response = Promise<ChallengeDto>

export class EditChallengeStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly roadmapsRepository: ChallengeRoadmapsRepository,
  ) {}

  async execute({ challengeId, starId }: Request): Response {
    const challenge = await this.findChallenge(Id.create(challengeId))
    await this.ensureChallengeIsNotPublishedInRoadmap(challenge.id)
    if (challenge.isStarChallenge.isTrue) throw new ChallengeIsAlreadyStarError()
    return this.updateStar(challenge, Id.create(starId))
  }

  private async findChallenge(challengeId: Id) {
    const challenge = await this.repository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }

  private async updateStar(
    challenge: Awaited<ReturnType<typeof this.findChallenge>>,
    starId: Id,
  ) {
    await this.findChallengeByStar(starId)
    challenge.starId = starId
    await this.repository.replace(challenge)
    return challenge.dto
  }

  private async findChallengeByStar(starId: Id) {
    const challenge = await this.repository.findByStar(starId)
    if (challenge) throw new ChallengeStarAlreadyInUseError()
  }

  private async ensureChallengeIsNotPublishedInRoadmap(challengeId: Id) {
    if (
      (await this.roadmapsRepository.hasChallengeInPublishedRevision(challengeId)).isTrue
    )
      throw new ChallengeBelongsToPublishedRoadmapError()
  }
}
