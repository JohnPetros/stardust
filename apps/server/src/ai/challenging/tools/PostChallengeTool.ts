import type {
  ChallengeCategoryDto,
  TestCaseDto,
} from '@stardust/core/challenging/entities/dtos'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Broker, Mcp, Tool } from '@stardust/core/global/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'
import { ENV } from '@/constants'

type Input = {
  title: string
  description: string
  code: string
  difficultyLevel: string
  testCases: TestCaseDto[]
  categories: ChallengeCategoryDto[]
}

export class PostChallengeTool implements Tool<Input> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly broker: Broker,
  ) {}

  async handle(mcp: Mcp<Input>) {
    const { title, description, code, difficultyLevel, testCases, categories } =
      mcp.getInput()
    const useCase = new PostChallengeUseCase(this.repository, this.broker)

    await useCase.execute({
      challengeDto: {
        title: title,
        description: description,
        code: code,
        difficultyLevel: difficultyLevel,
        testCases: testCases,
        categories: categories,
        author: {
          id:
            ENV.mode === 'production'
              ? 'df0757dd-3b9f-4d21-96cc-497483cc0f2e'
              : '99968fac-8a67-46c6-90e5-63ae175961b5',
          entity: {
            name: 'Agente criador de desafios',
            slug: 'mastra',
            avatar: {
              name: 'Mastra',
              image:
                'https://www.shutterstock.com/image-vector/chat-bot-ai-robot-icon-260nw-2559707511.jpg',
            },
          },
        },
      },
    })
  }
}
