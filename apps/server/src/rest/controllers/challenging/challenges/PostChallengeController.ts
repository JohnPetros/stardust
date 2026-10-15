import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import type { Broker, Controller, Http } from '@stardust/core/global/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  body: ChallengeDto
}

export class PostChallengeController implements Controller<Schema> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const challengeDto = await http.getBody()
    const useCase = this.createPostChallengeUseCase()
    const response = await useCase.execute({ challengeDto, challengeSourceId: null })
    return http.send(response)
  }

  private createPostChallengeUseCase() {
    return new PostChallengeUseCase(
      this.database,
      this.repository,
      this.challengeSourcesRepository,
      this.broker,
    )
  }
}
