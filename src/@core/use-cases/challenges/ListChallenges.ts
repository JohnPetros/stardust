import { Challenge, User } from '@/@core/domain/entities'
import { ChallengeCategory } from '@/@core/domain/entities/ChallengeCategory'
import type { ChallengeCompletionStatus } from '@/@core/domain/types'
import type { ChallengeDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { IChallengesService } from '@/@core/interfaces/services'
import type { ChallengesListParams } from '@/@core/types'

type Request = {
  userDTO: UserDTO
  listParams: ChallengesListParams
  completionStatus: ChallengeCompletionStatus | 'all'
}
type Response = Promise<ChallengeDTO[]>

export class ListChallengesUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengesService: IChallengesService) {}

  async do({ userDTO, completionStatus, listParams }: Request): Response {
    const user = User.create(userDTO)

    let [challenges, categories] = await Promise.all([
      this.fetchChallengesList(listParams),
      this.fetchCategories(),
    ])

    challenges = this.addCategoriesToEachChallenge(challenges, categories)

    challenges = this.filterChallengesByCompletionStatus(
      completionStatus,
      challenges,
      user,
    )

    return challenges.map((challenge) => challenge.dto)
  }

  private filterChallengesByCompletionStatus(
    completionStatus: ChallengeCompletionStatus | 'all',
    challenges: Challenge[],
    user: User,
  ) {
    switch (completionStatus) {
      case 'completed':
        return challenges.filter(
          (challenge) => user.hasCompletedChallenge(challenge.id).isTrue,
        )
      case 'not-completed':
        return challenges.filter(
          (challenge) => user.hasCompletedChallenge(challenge.id).isFalse,
        )
      default:
        return challenges
    }
  }

  private addCategoriesToEachChallenge(
    challenges: Challenge[],
    categories: ChallengeCategory[],
  ) {
    for (const challenge of challenges) {
      const challengeCategories = categories.filter(
        (category) => category.includesChallenge(challenge.id).isTrue,
      )
      challenge.categories = challengeCategories
    }
    return challenges
  }

  private async fetchChallengesList(params: ChallengesListParams) {
    const response = await this.challengesService.fetchChallengesList(params)
    if (response.isFailure) response.throwError()
    return response.data.map(Challenge.create)
  }

  private async fetchCategories() {
    const response = await this.challengesService.fetchCategories()
    if (response.isFailure) response.throwError()
    return response.data.map(ChallengeCategory.create)
  }
}
