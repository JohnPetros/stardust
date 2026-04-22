import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type { Mcp, Tool } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

type Input = {
  page?: number
  itemsPerPage?: number
  title?: string
  categoriesIds?: string[]
  difficulty: string
  upvotesCountOrder?: string
  downvoteCountOrder?: string
  completionCountOrder?: string
  postingOrder?: string
  completionStatus: string
  isNewStatus?: string
  userId?: string
  shouldIncludePrivateChallenges?: boolean
  shouldIncludeStarChallenges?: boolean
  shouldIncludeOnlyAuthorChallenges?: boolean
}

type Output = {
  items: ChallengeDto[]
  totalItemsCount: number
  page: number
  itemsPerPage: number
  totalPagesCount: number
}

export class ListChallengesTool implements Tool<Input, Output> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async handle(mcp: Mcp<Input>): Promise<Output> {
    const {
      page,
      itemsPerPage,
      title,
      categoriesIds,
      difficulty,
      upvotesCountOrder,
      downvoteCountOrder,
      completionCountOrder,
      postingOrder,
      completionStatus,
      isNewStatus,
      userId,
    } = mcp.getInput()
    const accountId = mcp.getAccountId()
    const completedChallengesIds: string[] = []

    if (accountId) {
      const user = await this.usersRepository.findById(Id.create(accountId))

      if (user) {
        completedChallengesIds.splice(
          0,
          completedChallengesIds.length,
          ...user.completedChallengesIds.dto,
        )
      }
    }

    const useCase = new ListChallengesUseCase(this.repository)

    return await useCase.execute({
      accountId,
      page: page ?? 1,
      itemsPerPage: itemsPerPage ?? 10,
      title: title ?? '',
      categoriesIds: categoriesIds ?? [],
      difficulty,
      upvotesCountOrder: upvotesCountOrder ?? 'all',
      downvoteCountOrder: downvoteCountOrder ?? 'all',
      completionCountOrder: completionCountOrder ?? 'all',
      postingOrder: postingOrder ?? 'all',
      completionStatus,
      isNewStatus: isNewStatus ?? 'all',
      userId,
      userCompletedChallengesIds: completedChallengesIds,
      shouldIncludePrivateChallenges: false,
      shouldIncludeStarChallenges: false,
      shouldIncludeOnlyAuthorChallenges: false,
    })
  }
}
