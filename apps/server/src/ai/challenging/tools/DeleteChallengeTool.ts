import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import {
  DeleteChallengeUseCase,
  GetChallengeUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Mcp, Tool } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

type Input = {
  challengeId: string
  confirmacao: true
}

export class DeleteChallengeTool implements Tool<Input> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(mcp: Mcp<Input>): Promise<void> {
    const accountId = mcp.getAccountId()
    const { challengeId, confirmacao } = mcp.getInput()

    this.verifyConfirmation(confirmacao)

    await this.deleteAuthorizedChallenge(accountId, challengeId)
  }

  private async deleteAuthorizedChallenge(accountId: string, challengeId: string) {
    await this.verifyAuthor(accountId, challengeId)
    await this.deleteChallenge(challengeId)
  }

  private verifyConfirmation(confirmation: boolean) {
    if (!confirmation) {
      throw new Error('A confirmacao explicita e obrigatoria para excluir desafios.')
    }
  }

  private async findChallenge(challengeId: string) {
    const useCase = new GetChallengeUseCase(this.repository)
    return Challenge.create(await useCase.execute({ challengeId }))
  }

  private async verifyAuthor(accountId: string, challengeId: string) {
    const challenge = await this.findChallenge(challengeId)

    if (!challenge.isChallengeAuthor(Id.create(accountId)).isTrue) {
      throw new ChallengeNotFoundError()
    }
  }

  private deleteChallenge(challengeId: string) {
    return this.createDeleteChallengeUseCase().execute({ challengeId })
  }

  private createDeleteChallengeUseCase() {
    return new DeleteChallengeUseCase(this.database, this.repository, new InngestBroker())
  }
}
