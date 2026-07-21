import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { RunChallengeCodeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http, LspProvider } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: {
    code: string
  }
}

export class RunChallengeCodeController implements Controller<Schema> {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly executionsRepository: ChallengeCodeExecutionsRepository,
    private readonly lspProvider: LspProvider,
  ) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { code } = await http.getBody()
    const userId = await http.getAccountId()

    const useCase = new RunChallengeCodeUseCase(
      this.challengesRepository,
      this.executionsRepository,
      this.lspProvider,
    )
    const response = await useCase.execute({ userId, challengeId, code })

    return http.statusCreated().send(response)
  }
}
