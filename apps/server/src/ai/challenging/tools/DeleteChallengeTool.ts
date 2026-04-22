import { Challenge } from '@stardust/core/challenging/entities'
import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import {
  DeleteChallengeUseCase,
  GetChallengeUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Mcp, Tool } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'

type Input = {
  challengeId: string
  confirmacao: true
}

export class DeleteChallengeTool implements Tool<Input> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(mcp: Mcp<Input>): Promise<void> {
    const accountId = mcp.getAccountId()
    const { challengeId, confirmacao } = mcp.getInput()

    if (!confirmacao) {
      throw new Error('A confirmacao explicita e obrigatoria para excluir desafios.')
    }

    const getChallengeUseCase = new GetChallengeUseCase(this.repository)
    const challengeDto = await getChallengeUseCase.execute({ challengeId })
    const challenge = Challenge.create(challengeDto)

    if (!challenge.isChallengeAuthor(Id.create(accountId)).isTrue) {
      throw new ChallengeNotFoundError()
    }

    const deleteChallengeUseCase = new DeleteChallengeUseCase(this.repository)

    await deleteChallengeUseCase.execute({ challengeId })
  }
}
