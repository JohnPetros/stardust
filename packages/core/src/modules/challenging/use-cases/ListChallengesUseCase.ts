import type { ChallengeCompletionStatus, ChallengesListParams } from '#challenging/types'
import type { ChallengeCategoryDto, ChallengeDto } from '#challenging/dtos'
import type { UserDto } from '#global/dtos'
import type { IChallengingService, IUseCase } from '#interfaces'
import { User } from '#global/entities'
import { Challenge } from '#challenging/entities'

type Request = {
  userDto: UserDto
  listParams: ChallengesListParams
  completionStatus: ChallengeCompletionStatus | 'all'
}
type Response = Promise<{
  challengesDto: ChallengeDto[]
  categoriesDto: ChallengeCategoryDto[]
}>

export class ListChallengesUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ userDto, completionStatus, listParams }: Request): Response {
    const user = User.create(userDto)

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

    challenges = this.orderChallengesByDifficultyLevel(challenges)

    return {
      challengesDto: challenges.map((challenge) => challenge.dto),
      categoriesDto: categories.map((challenge) => challenge.dto),
    }
  }

  private orderChallengesByDifficultyLevel(challenges: Challenge[]) {
    const easyChallenges = challenges.filter(
      (challenge) => challenge.difficulty.level === 'easy',
    )
    const mediumChallenges = challenges.filter(
      (challenge) => challenge.difficulty.level === 'medium',
    )
    const hardChallenges = challenges.filter(
      (challenge) => challenge.difficulty.level === 'hard',
    )

    return easyChallenges.concat(mediumChallenges, hardChallenges)
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
    const response = await this.challengingService.fetchChallengesList(params)
    if (response.isFailure) response.throwError()
    return response.body.map(Challenge.create)
  }

  private async fetchCategories() {
    const response = await this.challengingService.fetchCategories()
    if (response.isFailure) response.throwError()
    return response.body.map(ChallengeCategory.create)
  }
}
