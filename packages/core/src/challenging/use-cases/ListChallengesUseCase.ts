import type { UseCase } from '#global/interfaces/UseCase'
import { IdsList } from '#global/domain/structures/IdsList'
import { ListingOrder } from '#global/domain/structures/ListingOrder'
import { Id, Text, OrdinalNumber } from '#global/domain/structures/index'
import type { ChallengeDto } from '../domain/entities/dtos'
import type { Challenge } from '../domain/entities'
import { ChallengeCompletionStatus, ChallengeDifficulty } from '../domain/structures'
import { PaginationResponse } from '../../global/responses'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  userCompletedChallengesIds: string[]
  page: number
  itemsPerPage: number
  title: string
  categoriesIds: string[]
  difficulty: string
  upvotesCountOrder: string
  postingOrder: string
  completionStatus: string
  userId?: string
}
type Response = Promise<PaginationResponse<ChallengeDto>>

export class ListChallengesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute(request: Request) {
    const completedChallengesIds = IdsList.create(request.userCompletedChallengesIds)

    const response = await this.repository.findMany({
      categoriesIds: IdsList.create(request.categoriesIds),
      difficulty: ChallengeDifficulty.create(request.difficulty),
      title: Text.create(request.title),
      upvotesCountOrder: ListingOrder.create(request.upvotesCountOrder),
      postingOrder: ListingOrder.create(request.postingOrder),
      userId: request.userId ? Id.create(request.userId) : null,
      page: OrdinalNumber.create(request.page),
      itemsPerPage: OrdinalNumber.create(request.itemsPerPage),
      completionStatus: ChallengeCompletionStatus.create(request.completionStatus),
    })
    let challenges = response.challenges

    challenges = this.filterChallenges(
      ChallengeCompletionStatus.create(request.completionStatus),
      challenges,
      completedChallengesIds,
      request.userId ? Id.create(request.userId) : null,
    )
    challenges = this.orderChallengesByDifficultyLevel(challenges)

    return new PaginationResponse(
      challenges.map((challenge) => challenge.dto),
      response.totalChallengesCount,
    )
  }

  private orderChallengesByDifficultyLevel(challenges: Challenge[]): Challenge[] {
    const easyChallenges = challenges.filter(
      (challenge) => challenge.difficulty.isEasy.isTrue,
    )
    const mediumChallenges = challenges.filter(
      (challenge) => challenge.difficulty.isMedium.isTrue,
    )
    const hardChallenges = challenges.filter(
      (challenge) => challenge.difficulty.isHard.isTrue,
    )

    return easyChallenges.concat(mediumChallenges, hardChallenges)
  }

  private filterChallenges(
    challengeCompletionStatus: ChallengeCompletionStatus,
    challenges: Challenge[],
    completedChallengesIds: IdsList,
    userId: Id | null,
  ): Challenge[] {
    switch (challengeCompletionStatus.value) {
      case 'completed':
        return challenges.filter((challenge) => {
          const isCompleted = completedChallengesIds.includes(challenge.id)
          if (challenge.author.id.value === userId?.value) {
            return isCompleted.isTrue
          }
          return challenge.isPublic.and(isCompleted).isTrue
        })
      case 'not-completed':
        return challenges.filter((challenge) => {
          const isCompleted = completedChallengesIds.includes(challenge.id)
          if (challenge.author.id.value === userId?.value) {
            return isCompleted.isFalse
          }
          return challenge.isPublic.andNot(isCompleted).isTrue
        })
      default:
        return challenges
    }
  }
}
