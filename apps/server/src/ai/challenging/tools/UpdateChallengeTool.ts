import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import {
  GetChallengeUseCase,
  UpdateChallengeUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Mcp, Tool } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'

type Input = {
  challengeId: string
  title: string
  description: string
  code: string
  isPublic?: boolean
  difficultyLevel: string
  testCases: ChallengeDto['testCases']
  categories: ChallengeDto['categories']
}

export class UpdateChallengeTool implements Tool<Input, ChallengeDto> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(mcp: Mcp<Input>): Promise<ChallengeDto> {
    const accountId = mcp.getAccountId()
    const {
      challengeId,
      title,
      description,
      code,
      isPublic,
      difficultyLevel,
      testCases,
      categories,
    } = mcp.getInput()

    const getChallengeUseCase = new GetChallengeUseCase(this.repository)
    const currentChallenge = Challenge.create(
      await getChallengeUseCase.execute({ challengeId }),
    )

    if (!currentChallenge.isChallengeAuthor(Id.create(accountId)).isTrue) {
      throw new ChallengeNotFoundError()
    }

    const updateChallengeUseCase = new UpdateChallengeUseCase(this.repository)

    return await updateChallengeUseCase.execute({
      challengeDto: {
        id: challengeId,
        title,
        description,
        code,
        difficultyLevel,
        testCases,
        categories,
        author: currentChallenge.author.dto,
        isPublic: isPublic ?? currentChallenge.isPublic.value,
      },
    })
  }
}
