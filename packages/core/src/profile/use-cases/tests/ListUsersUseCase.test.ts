import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { ListUsersUseCase } from '../ListUsersUseCase'
import { Text } from '#global/domain/structures/Text'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Sorter } from '#global/domain/structures/Sorter'
import { SpaceCompletionStatus } from '#profile/domain/structures/SpaceCompletionStatus'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'

describe('List Users Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: ListUsersUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findMany.mockImplementation()
    useCase = new ListUsersUseCase(repository)
  })

  it('should try to find many users', async () => {
    repository.findMany.mockResolvedValue({
      items: [],
      count: 0,
    })
    const request = {
      search: Text.create(''),
      page: OrdinalNumber.create(1),
      itemsPerPage: OrdinalNumber.create(10),
      levelOrder: Sorter.create('none'),
      weeklyXpOrder: Sorter.create('none'),
      unlockedStarCountOrder: Sorter.create('none'),
      unlockedAchievementCountOrder: Sorter.create('none'),
      completedChallengeCountOrder: Sorter.create('none'),
      spaceCompletionStatus: SpaceCompletionStatus.create('all'),
      insigniaRoles: [],
    }

    await useCase.execute({
      search: request.search.value,
      page: request.page.value,
      itemsPerPage: request.itemsPerPage.value,
      levelOrder: 'none',
      weeklyXpOrder: 'none',
      unlockedStarCountOrder: 'none',
      unlockedAchievementCountOrder: 'none',
      completedChallengeCountOrder: 'none',
      spaceCompletionStatus: 'all',
      insigniaRoles: [],
    })

    expect(repository.findMany).toHaveBeenCalledWith(request)
  })

  it('should return a pagination response with the found users', async () => {
    const users = UsersFaker.fakeMany(10)
    repository.findMany.mockResolvedValue({
      items: users,
      count: users.length,
    })
    const request = {
      search: Text.create(''),
      page: OrdinalNumber.create(1),
      itemsPerPage: OrdinalNumber.create(10),
      levelOrder: Sorter.create('none'),
      weeklyXpOrder: Sorter.create('none'),
      unlockedStarCountOrder: Sorter.create('none'),
      unlockedAchievementCountOrder: Sorter.create('none'),
      completedChallengeCountOrder: Sorter.create('none'),
      spaceCompletionStatus: SpaceCompletionStatus.create('all'),
      insigniaRoles: [],
    }

    const response = await useCase.execute({
      search: request.search.value,
      page: request.page.value,
      itemsPerPage: request.itemsPerPage.value,
      levelOrder: 'none',
      weeklyXpOrder: 'none',
      unlockedStarCountOrder: 'none',
      unlockedAchievementCountOrder: 'none',
      completedChallengeCountOrder: 'none',
      spaceCompletionStatus: 'all',
      insigniaRoles: [],
    })

    expect(response).toBeInstanceOf(PaginationResponse)
    expect(response).toEqual(
      new PaginationResponse(
        users.map((user) => user.dto),
        users.length,
        request.itemsPerPage.value,
      ),
    )
  })
})
