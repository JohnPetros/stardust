import { mock, type Mock } from 'ts-jest-mocker'

import { UpdateUserUseCase } from '../UpdateUserUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { GalaxyAggregatesFaker } from '#profile/domain/aggregates/fakers/GalaxyAggregatesFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'

describe('Update User Use Case', () => {
  let useCase: UpdateUserUseCase
  let repository: Mock<UsersRepository>

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateUserUseCase(repository)
  })

  it('should throw when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute(UsersFaker.fakeDto())).rejects.toThrow(UserNotFoundError)
    expect(repository.replace).not.toHaveBeenCalled()
  })

  it('should replace the user with the client changes', async () => {
    const persisted = UsersFaker.fake()
    repository.findById.mockResolvedValue(persisted)

    const response = await useCase.execute({ ...persisted.dto, name: 'Novo nome' })

    expect(repository.findById).toHaveBeenCalledWith(persisted.id)
    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('Novo nome')
  })

  it('should keep the persisted current galaxy and space completion, ignoring client values', async () => {
    const persistedGalaxy = GalaxyAggregatesFaker.fakeDto()
    const persisted = UsersFaker.fake({
      currentGalaxy: persistedGalaxy,
      hasCompletedSpace: true,
    })
    repository.findById.mockResolvedValue(persisted)

    const response = await useCase.execute({
      ...persisted.dto,
      currentGalaxy: null,
      hasCompletedSpace: false,
    })

    const replaced = repository.replace.mock.calls[0][0]
    expect(replaced.currentGalaxy?.dto).toEqual(persistedGalaxy)
    expect(replaced.hasCompletedSpace.isTrue).toBe(true)
    expect(response.currentGalaxy).toEqual(persistedGalaxy)
    expect(response.hasCompletedSpace).toBe(true)
  })

  it('should keep a null current galaxy when the account has none', async () => {
    const persisted = UsersFaker.fake({ currentGalaxy: null, hasCompletedSpace: false })
    repository.findById.mockResolvedValue(persisted)

    const response = await useCase.execute({
      ...persisted.dto,
      currentGalaxy: GalaxyAggregatesFaker.fakeDto(),
      hasCompletedSpace: true,
    })

    expect(response.currentGalaxy).toBeNull()
    expect(response.hasCompletedSpace).toBe(false)
  })
})
