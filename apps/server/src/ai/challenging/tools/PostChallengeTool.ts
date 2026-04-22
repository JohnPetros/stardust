import type {
  ChallengeCategoryDto,
  TestCaseDto,
} from '@stardust/core/challenging/entities/dtos'
import type {
  ChallengesRepository,
  ChallengeSourcesRepository,
} from '@stardust/core/challenging/interfaces'
import type { Broker, Mcp, Tool } from '@stardust/core/global/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'

type Input = {
  title: string
  description: string
  code: string
  difficultyLevel: string
  testCases: TestCaseDto[]
  categories: ChallengeCategoryDto[]
  challengeSourceId?: string | null
}

export class PostChallengeTool implements Tool<Input> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly broker: Broker,
  ) {}

  async handle(mcp: Mcp<Input>) {
    const {
      title,
      description,
      code,
      difficultyLevel,
      testCases,
      categories,
      challengeSourceId,
    } = mcp.getInput()
    const accountId = mcp.getAccountId()
    const useCase = new PostChallengeUseCase(
      this.repository,
      this.challengeSourcesRepository,
      this.broker,
    )

    await useCase.execute({
      challengeDto: {
        title: title,
        description: description,
        code: code,
        difficultyLevel: difficultyLevel,
        testCases: testCases,
        categories: categories,
        author: {
          id: accountId,
        },
        isPublic: false,
      },
      challengeSourceId: challengeSourceId ?? null,
    })
  }
}
