import type { UseCase } from '#global/interfaces/index'
import { Id, Slug } from '#global/domain/structures/index'
import { Solution } from '../domain/entities'
import type { ChallengesRepository, SolutionsRepository } from '../interfaces'
import type { SolutionDto } from '../domain/entities/dtos'
import { ChallengeNotFoundError, SolutionTitleAlreadyInUseError } from '../domain/errors'

type Request = {
  solutionTitle: string
  solutionContent: string
  authorId: string
  challengeId: string
}

type Response = Promise<SolutionDto>

export class PostSolutionUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly solutionsRepository: SolutionsRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async execute({ solutionTitle, solutionContent, authorId, challengeId }: Request) {
    await this.checkIfSolutionTitleIsInUse(solutionTitle)
    await this.checkIfChallengeExists(Id.create(challengeId))

    const solution = Solution.create({
      title: solutionTitle,
      content: solutionContent,
      author: { id: authorId },
    })

    await this.solutionsRepository.add(solution, Id.create(challengeId))
    return solution.dto
  }

  private async checkIfSolutionTitleIsInUse(solutionTitle: string) {
    const solution = await this.solutionsRepository.findBySlug(Slug.create(solutionTitle))
    if (solution) throw new SolutionTitleAlreadyInUseError()
  }

  private async checkIfChallengeExists(challengeId: Id) {
    const challenge = await this.challengesRepository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }
}
