import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/index'
import { UpdateRankingPositionsUseCase } from '../UpdateRankingPositionsUseCase'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { Id, Integer } from '#global/domain/structures/index'

describe('Update Ranking Position Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: UpdateRankingPositionsUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findByTierOrderedByXp.mockImplementation()
    repository.replaceMany.mockImplementation()
    useCase = new UpdateRankingPositionsUseCase(repository)
  })

  it('should update the ranking position of each user', async () => {
    const updateRankingPosition = jest.fn()
    const users = UsersFaker.fakeMany(6).map((user) => {
      user.updateRankingPosition = updateRankingPosition
      return user
    })
    repository.findByTierOrderedByXp.mockResolvedValue(users)

    await useCase.execute(Id.create().value)

    expect(updateRankingPosition).toHaveBeenCalledTimes(users.length)
    expect(updateRankingPosition).toHaveBeenCalledWith(Integer.create(1))
    expect(updateRankingPosition).toHaveBeenCalledWith(Integer.create(2))
    expect(updateRankingPosition).toHaveBeenCalledWith(Integer.create(3))
    expect(updateRankingPosition).toHaveBeenCalledWith(Integer.create(4))
    expect(updateRankingPosition).toHaveBeenCalledWith(Integer.create(5))
    expect(updateRankingPosition).toHaveBeenCalledWith(Integer.create(6))
  })

  it('should replace the users in the repository', async () => {
    const users = UsersFaker.fakeMany(6)
    repository.findByTierOrderedByXp.mockResolvedValue(users)

    await useCase.execute(Id.create().value)

    expect(repository.replaceMany).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledWith(users)
  })
})
