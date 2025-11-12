import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  body: ChallengeDto
}

export class PostChallengeController implements Controller<Schema> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const challengeDto = await http.getBody()
    const useCase = new PostChallengeUseCase(this.repository)
    const response = await useCase.execute({ challengeDto })
    return http.send(response)
  }
}
