import type { UseCase } from '#global/interfaces/UseCase'
import { Id, Logical } from '#global/domain/structures/index'
import type { ChallengeSourceDto } from '../domain/entities/dtos'
import { ChallengeSource, type Challenge } from '../domain/entities'
import { ChallengeNotFoundError, ChallengeSourceNotFoundError } from '../domain/errors'
import type { ChallengeSourcesRepository, ChallengesRepository } from '../interfaces'

type Request = {
  challengeSourceId: string
  challengeId: string
  url: string
}

type Response = Promise<ChallengeSourceDto>

export class UpdateChallengeSourceUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async execute({ challengeSourceId, challengeId, url }: Request): Response {
    const challengeSource = await this.findChallengeSource(Id.create(challengeSourceId))
    const challenge = await this.findChallenge(Id.create(challengeId))
    const updatedChallengeSource = this.updateChallengeSource(
      challengeSource,
      challenge,
      url,
    )

    await this.challengeSourcesRepository.replace(updatedChallengeSource)
    return updatedChallengeSource.dto
  }

  private async findChallengeSource(challengeSourceId: Id): Promise<ChallengeSource> {
    const challengeSource =
      await this.challengeSourcesRepository.findById(challengeSourceId)
    if (!challengeSource) throw new ChallengeSourceNotFoundError()
    return challengeSource
  }

  private async findChallenge(challengeId: Id): Promise<Challenge> {
    const challenge = await this.challengesRepository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }

  private updateChallengeSource(
    challengeSource: ChallengeSource,
    challenge: Challenge,
    url: string,
  ): ChallengeSource {
    return ChallengeSource.create({
      id: challengeSource.id.value,
      url,
      isUsed: Logical.create(true).value,
      position: challengeSource.position.value,
      challenge: {
        id: challenge.id.value,
        title: challenge.title.value,
        slug: challenge.slug.value,
      },
    })
  }
}
