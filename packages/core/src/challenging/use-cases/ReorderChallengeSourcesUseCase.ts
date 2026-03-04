import { ConflictError } from '#global/domain/errors/ConflictError'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeSourceDto } from '../domain/entities/dtos'
import type { ChallengeSource } from '../domain/entities'
import { ChallengeSourceNotFoundError } from '../domain/errors'
import type { ChallengeSourcesRepository } from '../interfaces'

type Request = {
  challengeSourceIds: string[]
}

type Response = Promise<ChallengeSourceDto[]>

export class ReorderChallengeSourcesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async execute({ challengeSourceIds }: Request): Response {
    if (challengeSourceIds.length === 0) {
      throw new ConflictError('Informe ao menos uma fonte para reordenação')
    }

    if (new Set(challengeSourceIds).size !== challengeSourceIds.length) {
      throw new ConflictError('Os IDs das fontes devem ser únicos')
    }

    const challengeSources = await this.repository.findAll()
    const reorderedChallengeSources: ChallengeSource[] = []
    const challengeSourcesMap = new Map(
      challengeSources.map((challengeSource) => [
        challengeSource.id.value,
        challengeSource,
      ]),
    )

    const positions = challengeSourceIds
      .map((challengeSourceId) => {
        const challengeSource = challengeSourcesMap.get(challengeSourceId)

        if (!challengeSource) throw new ChallengeSourceNotFoundError()

        return challengeSource.position.value
      })
      .sort((a, b) => a - b)

    for (let index = 0; index < challengeSourceIds.length; index++) {
      const challengeSourceId = challengeSourceIds[index]
      const challengeSource = challengeSourcesMap.get(challengeSourceId)
      if (!challengeSource) throw new ChallengeSourceNotFoundError()

      challengeSource.position = OrdinalNumber.create(
        positions[index],
        'Posição da fonte',
      )
      reorderedChallengeSources.push(challengeSource)
    }

    await this.repository.replaceMany(reorderedChallengeSources)
    return reorderedChallengeSources.map((challengeSource) => challengeSource.dto)
  }
}
