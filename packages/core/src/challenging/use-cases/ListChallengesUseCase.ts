import type { ChallengeCompletionStatus, ChallengesListParams } from '../domain/types'
import type { ChallengeDto } from '../dtos'
import type { UserDto } from '../../global/dtos'
import type { IChallengingService, IUseCase } from '../../global/interfaces'
import type { ListParam } from '../../global/domain/types'
import { User } from '../../global/domain/entities'
import { Challenge } from '../domain/entities'
import { PaginationResponse } from '../../global/responses'

type Request = {
  userDto: UserDto
  listParams: Omit<ChallengesListParams, 'postOrder' | 'upvotesCountOrder' | 'userId'>
  completionStatus: ListParam<ChallengeCompletionStatus>
}
type Response = Promise<PaginationResponse<ChallengeDto>>

export class ListChallengesUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ userDto, completionStatus, listParams }: Request): Response {
    const user = User.create(userDto)

    const challengesPagination = await this.fetchChallengesList({
      ...listParams,
      postOrder: 'all',
      upvotesCountOrder: 'all',
      userId: null,
    })
    let challenges = challengesPagination.items.map(Challenge.create)

    challenges = this.filterChallenges(completionStatus, challenges, user)

    challenges = this.orderChallengesByDifficultyLevel(challenges)

    return new PaginationResponse(
      challenges.map((challenge) => challenge.dto),
      challengesPagination.count,
    )
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

  private filterChallenges(
    completionStatus: ChallengeCompletionStatus | 'all',
    challenges: Challenge[],
    user: User,
  ) {
    switch (completionStatus) {
      case 'completed':
        return challenges.filter((challenge) => {
          const isCompleted = user.hasCompletedChallenge(challenge.id)
          if (challenge.author.isEqualTo(user).isTrue) {
            return isCompleted.isTrue
          }
          return isCompleted.isTrue && challenge.isPublic.isTrue
        })
      case 'not-completed':
        return challenges.filter((challenge) => {
          const isCompleted = user.hasCompletedChallenge(challenge.id)
          if (challenge.author.isEqualTo(user).isTrue) {
            return isCompleted.isFalse
          }
          return isCompleted.isFalse && challenge.isPublic.isTrue
        })
      default:
        return challenges
    }
  }

  private async fetchChallengesList(params: ChallengesListParams) {
    const response = await this.challengingService.fetchChallengesList(params)
    if (response.isFailure) response.throwError()
    return response.body
  }
}
