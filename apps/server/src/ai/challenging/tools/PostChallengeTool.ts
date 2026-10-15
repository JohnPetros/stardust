import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type {
  ChallengeDto,
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
  initialCode: string
  difficultyLevel: string
  testCases: TestCaseDto[]
  categories: ChallengeCategoryDto[]
  challengeSourceId?: string | null
  isEvaluatedByFunction?: boolean
}

export class PostChallengeTool implements Tool<Input, ChallengeDto> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(mcp: Mcp<Input>): Promise<ChallengeDto> {
    const input = mcp.getInput()
    const accountId = mcp.getAccountId()
    return this.createPostChallengeUseCase().execute({
      challengeDto: this.challengeDto(input, accountId),
      challengeSourceId: input.challengeSourceId ?? null,
    })
  }

  private challengeDto(input: Input, accountId: string): ChallengeDto {
    return {
      ...this.challengeContent(input),
      author: { id: accountId },
      isPublic: false,
      isEvaluatedByFunction: input.isEvaluatedByFunction ?? true,
      isNew: true,
    }
  }

  private challengeContent(input: Input) {
    const { title, description, initialCode, difficultyLevel, testCases, categories } =
      input
    return { title, description, initialCode, difficultyLevel, testCases, categories }
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
