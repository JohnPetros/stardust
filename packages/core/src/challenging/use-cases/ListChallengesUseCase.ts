import type { UseCase } from '#global/interfaces/UseCase'
import { IdsList } from '#global/domain/structures/IdsList'
import { ListingOrder } from '#global/domain/structures/ListingOrder'
import { Id, Text, OrdinalNumber, Logical } from '#global/domain/structures/index'
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
  accountId: string
  shouldIncludePrivateChallenges: boolean
  shouldIncludeStarChallenges: boolean
  shouldIncludeOnlyAuthorChallenges: boolean
}
type Response = Promise<PaginationResponse<ChallengeDto>>

export class ListChallengesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute(request: Request) {
    const completedChallengesIds = IdsList.create(request.userCompletedChallengesIds)

    const { items, count } = await this.repository.findMany({
      categoriesIds: IdsList.create(request.categoriesIds),
      difficulty: ChallengeDifficulty.create(request.difficulty),
      title: Text.create(request.title),
      upvotesCountOrder: ListingOrder.create(request.upvotesCountOrder),
      postingOrder: ListingOrder.create(request.postingOrder),
      userId: request.userId ? Id.create(request.userId) : null,
      page: OrdinalNumber.create(request.page),
      itemsPerPage: OrdinalNumber.create(request.itemsPerPage),
      completionStatus: ChallengeCompletionStatus.create(request.completionStatus),
      shouldIncludeStarChallenges: Logical.create(request.shouldIncludeStarChallenges),
      shouldIncludeOnlyAuthorChallenges: Logical.create(
        request.shouldIncludeOnlyAuthorChallenges,
      ),
    })
    let challenges = items

    challenges = this.filterChallenges(
      ChallengeCompletionStatus.create(request.completionStatus),
      challenges,
      completedChallengesIds,
      Id.create(request.accountId),
      Logical.create(request.shouldIncludeStarChallenges),
    )
    challenges = this.orderChallengesByDifficultyLevel(challenges)

    return new PaginationResponse(
      challenges.map((challenge) => challenge.dto),
      count,
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
    accountId: Id,
    shouldIncludePrivateChallenges: Logical,
  ): Challenge[] {
    switch (challengeCompletionStatus.value) {
      case 'completed':
        return challenges.filter((challenge) => {
          const isCompleted = completedChallengesIds.includes(challenge.id)
          const isAccountAuthor = challenge.isChallengeAuthor(accountId)
          if (shouldIncludePrivateChallenges.or(isAccountAuthor).isTrue) {
            return isCompleted.isTrue
          }
          return challenge.isPublic.and(isCompleted).isTrue
        })
      case 'not-completed':
        return challenges.filter((challenge) => {
          const isCompleted = completedChallengesIds.includes(challenge.id)
          const isAccountAuthor = challenge.isChallengeAuthor(accountId)
          if (shouldIncludePrivateChallenges.or(isAccountAuthor).isTrue) {
            return isCompleted.isFalse
          }
          return challenge.isPublic.andNot(isCompleted).isTrue
        })
      default:
        return challenges.filter((challenge) => {
          const isAccountAuthor = challenge.isChallengeAuthor(accountId)
          if (shouldIncludePrivateChallenges.or(isAccountAuthor).isTrue) {
            return challenge
          }
          return challenge.isPublic.isTrue
        })
    }
  }
}
