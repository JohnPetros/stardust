import type { UseCase } from '#global/interfaces/UseCase'
import type { Id, Slug } from '#global/domain/structures/index'
import type { ChallengeDto } from '../domain/entities/dtos'
import type { ChallengeRoadmapsRepository, ChallengesRepository } from '../interfaces'
import { Challenge } from '../domain/entities'
import {
  ChallengeAlreadyExistsError,
  ChallengeBelongsToPublishedRoadmapError,
  ChallengeNotFoundError,
} from '../domain/errors'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class UpdateChallengeUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly roadmapsRepository: ChallengeRoadmapsRepository,
  ) {}

  async execute({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    const currentChallenge = await this.findChallenge(challenge.id)

    await this.ensureTitleIsAvailable(currentChallenge, challenge)
    await this.ensureChallengeCanBeUpdated(challenge)
    return this.replaceAndFind(challenge)
  }

  private async ensureTitleIsAvailable(
    currentChallenge: Challenge,
    challenge: Challenge,
  ) {
    if (currentChallenge.hasSameTitle(challenge).isFalse)
      await this.findChallengeBySlug(challenge.slug)
  }

  private async ensureChallengeCanBeUpdated(challenge: Challenge) {
    if (challenge.isPublic.isFalse)
      await this.ensureChallengeIsNotPublishedInRoadmap(challenge.id)
  }

  private async replaceAndFind(challenge: Challenge) {
    await this.repository.replace(challenge)
    const updatedChallenge = await this.findChallenge(challenge.id)
    return updatedChallenge.dto
  }

  private async findChallenge(challengeId: Id) {
    const challenge = await this.repository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }

  private async findChallengeBySlug(challengeSlug: Slug) {
    const challenge = await this.repository.findBySlug(challengeSlug)
    if (challenge) throw new ChallengeAlreadyExistsError()
  }

  private async ensureChallengeIsNotPublishedInRoadmap(challengeId: Id) {
    if (
      (await this.roadmapsRepository.hasChallengeInPublishedRevision(challengeId)).isTrue
    )
      throw new ChallengeBelongsToPublishedRoadmapError()
  }
}
