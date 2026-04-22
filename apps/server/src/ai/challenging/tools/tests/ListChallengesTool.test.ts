import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { Mcp } from '@stardust/core/global/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { ListChallengesTool } from '../ListChallengesTool'

describe('List Challenges Tool', () => {
  let repository: Mock<ChallengesRepository>
  let usersRepository: Mock<UsersRepository>
  let mcp: Mock<Mcp<any>>
  let tool: ListChallengesTool

  beforeEach(() => {
    jest.restoreAllMocks()
    repository = mock()
    usersRepository = mock()
    mcp = mock()
    tool = new ListChallengesTool(repository, usersRepository)
  })

  it('should list only the public catalog and enrich completed challenges from the authenticated account', async () => {
    const accountId = '99968fac-8a67-46c6-90e5-63ae175961b5'
    const response = {
      items: [],
      totalItemsCount: 0,
      page: 2,
      itemsPerPage: 5,
      totalPagesCount: 0,
    }

    mcp.getInput.mockReturnValue({
      page: 2,
      itemsPerPage: 5,
      title: 'busca',
      categoriesIds: ['550e8400-e29b-41d4-a716-446655440000'],
      difficulty: 'medium',
      upvotesCountOrder: 'descending',
      downvoteCountOrder: 'ascending',
      completionCountOrder: 'descending',
      postingOrder: 'ascending',
      completionStatus: 'completed',
      isNewStatus: 'new',
      userId: '34de8db6-c4c6-41fe-af7c-59f5099ce377',
    })
    mcp.getAccountId.mockReturnValue(accountId)
    usersRepository.findById.mockResolvedValue(
      UsersFaker.fake({
        completedChallengesIds: [
          '550e8400-e29b-41d4-a716-446655440001',
          '550e8400-e29b-41d4-a716-446655440002',
        ],
      }),
    )

    const executeSpy = jest
      .spyOn(ListChallengesUseCase.prototype, 'execute')
      .mockResolvedValue(response as never)

    const result = await tool.handle(mcp)

    expect(usersRepository.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: accountId }),
    )
    expect(executeSpy).toHaveBeenCalledWith({
      accountId,
      page: 2,
      itemsPerPage: 5,
      title: 'busca',
      categoriesIds: ['550e8400-e29b-41d4-a716-446655440000'],
      difficulty: 'medium',
      upvotesCountOrder: 'descending',
      downvoteCountOrder: 'ascending',
      completionCountOrder: 'descending',
      postingOrder: 'ascending',
      completionStatus: 'completed',
      isNewStatus: 'new',
      userId: '34de8db6-c4c6-41fe-af7c-59f5099ce377',
      userCompletedChallengesIds: [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
      ],
      shouldIncludePrivateChallenges: false,
      shouldIncludeStarChallenges: false,
      shouldIncludeOnlyAuthorChallenges: false,
    })
    expect(result).toEqual(response)
  })

  it('should send an empty completed challenges list when the authenticated user record is missing', async () => {
    const accountId = '99968fac-8a67-46c6-90e5-63ae175961b5'

    mcp.getInput.mockReturnValue({
      difficulty: 'easy',
      completionStatus: 'all',
    })
    mcp.getAccountId.mockReturnValue(accountId)
    usersRepository.findById.mockResolvedValue(null)

    const executeSpy = jest
      .spyOn(ListChallengesUseCase.prototype, 'execute')
      .mockResolvedValue({
        items: [],
        totalItemsCount: 0,
        page: 1,
        itemsPerPage: 10,
        totalPagesCount: 0,
      } as never)

    await tool.handle(mcp)

    expect(executeSpy).toHaveBeenCalledWith({
      accountId,
      page: 1,
      itemsPerPage: 10,
      title: '',
      categoriesIds: [],
      difficulty: 'easy',
      upvotesCountOrder: 'all',
      downvoteCountOrder: 'all',
      completionCountOrder: 'all',
      postingOrder: 'all',
      completionStatus: 'all',
      isNewStatus: 'all',
      userId: undefined,
      userCompletedChallengesIds: [],
      shouldIncludePrivateChallenges: false,
      shouldIncludeStarChallenges: false,
      shouldIncludeOnlyAuthorChallenges: false,
    })
  })
})
