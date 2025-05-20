import { mock, type Mock } from 'ts-jest-mocker'
import { UpdateTierUseCase } from '../UpdateTierUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { Id } from '#global/domain/structures/Id'
import { IdsList } from '#global/domain/structures/IdsList'

describe('Update Tier Use Case', () => {
  let useCase: UpdateTierUseCase
  let repository: Mock<UsersRepository>

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findByIdsList.mockImplementation()
    repository.replaceMany.mockImplementation()
    useCase = new UpdateTierUseCase(repository)
  })

  it('should find the users by their ids', async () => {
    const users = UsersFaker.fakeMany(10)
    const tierId = Id.create()
    const usersIds = users.map((user) => user.id.value)
    repository.findByIdsList.mockResolvedValue(users)

    await useCase.execute({
      tierId: tierId.value,
      usersIds,
    })

    expect(repository.findByIdsList).toHaveBeenCalledWith(IdsList.create(usersIds))
  })

  it('should update the tier of each user', async () => {
    const updateTier = jest.fn()
    const users = UsersFaker.fakeMany(10).map((user) => {
      user.updateTier = updateTier
      return user
    })
    const tierId = Id.create()
    repository.findByIdsList.mockResolvedValue(users)

    await useCase.execute({
      tierId: tierId.value,
      usersIds: users.map((user) => user.id.value),
    })

    expect(updateTier).toHaveBeenCalledTimes(users.length)
    users.forEach(() => expect(updateTier).toHaveBeenCalledWith(tierId))
  })

  it('should replace the users with the updated ones in the repository', async () => {
    const users = UsersFaker.fakeMany(10)
    const tierId = Id.create()
    repository.findByIdsList.mockResolvedValue(users)

    await useCase.execute({
      tierId: tierId.value,
      usersIds: users.map((user) => user.id.value),
    })

    expect(repository.replaceMany).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledWith(users)
  })
})
