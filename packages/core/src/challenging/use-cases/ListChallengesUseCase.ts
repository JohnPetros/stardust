import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengesRepository } from '../interfaces'
import { IdsList } from '#global/domain/structures/IdsList'
import { ListingOrder } from '#global/domain/structures/ListingOrder'
import { Id, Text, OrdinalNumber, Logical } from '#global/domain/structures/index'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
  ChallengeIsNewStatus,
} from '../domain/structures'
import type { ChallengeDto } from '../domain/entities/dtos'
import { PaginationResponse } from '#global/responses/PaginationResponse'

type Request = {
  userCompletedChallengesIds: string[]
  page: number
  itemsPerPage: number
  title: string
  categoriesIds: string[]
  difficulty: string
  upvotesCountOrder: string
  downvoteCountOrder: string
  completionCountOrder: string
  postingOrder: string
  completionStatus: string
  isNewStatus: string
  userId?: string
  accountId?: string
  shouldIncludePrivateChallenges: boolean
  shouldIncludeStarChallenges: boolean
  shouldIncludeOnlyAuthorChallenges: boolean
}

type Response = Promise<PaginationResponse<ChallengeDto>>

export class ListChallengesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  private getDifficultyRank(difficultyLevel: string) {
    switch (difficultyLevel) {
      case 'easy':
        return 0
      case 'medium':
        return 1
      case 'hard':
        return 2
      default:
        return 3
    }
  }

  private filterVisibleChallenges(challenges: ChallengeDto[], request: Request) {
    if (request.completionStatus === 'all' || !request.userId) return challenges

    const completedChallengesIds = new Set(request.userCompletedChallengesIds)

    return challenges.filter((challenge) => {
      const isChallengeCompleted = challenge.id
        ? completedChallengesIds.has(challenge.id)
        : false
      const isOwnChallenge = challenge.author.id === request.userId
      const canAccessChallenge = challenge.isPublic || isOwnChallenge

      if (request.completionStatus === 'completed') {
        return isChallengeCompleted && canAccessChallenge
      }

      return !isChallengeCompleted && canAccessChallenge
    })
  }

  private sortChallenges(challenges: ChallengeDto[]) {
    return [...challenges].sort((leftChallenge, rightChallenge) => {
      return (
        this.getDifficultyRank(leftChallenge.difficultyLevel) -
        this.getDifficultyRank(rightChallenge.difficultyLevel)
      )
    })
  }

  async execute(request: Request): Response {
    const { items, count } = await this.repository.findMany({
      categoriesIds: IdsList.create(request.categoriesIds),
      difficulty: ChallengeDifficulty.create(request.difficulty),
      title: Text.create(request.title),
      upvotesCountOrder: ListingOrder.create(request.upvotesCountOrder),
      downvoteCountOrder: ListingOrder.create(request.downvoteCountOrder),
      completionCountOrder: ListingOrder.create(request.completionCountOrder),
      postingOrder: ListingOrder.create(request.postingOrder),
      userId: request.userId ? Id.create(request.userId) : null,
      accountId: request.accountId ? Id.create(request.accountId) : null,
      completedChallengesIds: IdsList.create(request.userCompletedChallengesIds),
      page: OrdinalNumber.create(request.page),
      itemsPerPage: OrdinalNumber.create(request.itemsPerPage),
      completionStatus: ChallengeCompletionStatus.create(request.completionStatus),
      isNewStatus: ChallengeIsNewStatus.create(request.isNewStatus),
      shouldIncludeStarChallenges: Logical.create(request.shouldIncludeStarChallenges),
      shouldIncludeOnlyAuthorChallenges: Logical.create(
        request.shouldIncludeOnlyAuthorChallenges,
      ),
      shouldIncludePrivateChallenges: Logical.create(
        request.shouldIncludePrivateChallenges,
      ),
    })
    const challenges = this.sortChallenges(
      this.filterVisibleChallenges(
        items.map((challenge) => challenge.dto),
        request,
      ),
    )

    return new PaginationResponse({
      items: challenges,
      totalItemsCount: count,
      itemsPerPage: request.itemsPerPage,
      page: request.page,
    })
  }
}
