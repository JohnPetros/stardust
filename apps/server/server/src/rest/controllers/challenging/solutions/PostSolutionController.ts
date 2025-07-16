import type { Controller, Http } from '@stardust/core/global/interfaces'
import type {
  ChallengesRepository,
  SolutionsRepository,
} from '@stardust/core/challenging/interfaces'
import { PostSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  body: {
    challengeId: string
    solutionTitle: string
    solutionContent: string
  }
}

export class PostSolutionController implements Controller<Schema> {
  constructor(
    private readonly solutionsRepository: SolutionsRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { challengeId, solutionTitle, solutionContent } = await http.getBody()
    const authorId = await http.getAccountId()
    const useCase = new PostSolutionUseCase(
      this.solutionsRepository,
      this.challengesRepository,
    )
    const solution = await useCase.execute({
      challengeId,
      solutionTitle,
      authorId,
      solutionContent,
    })
    return http.send(solution)
  }
}
