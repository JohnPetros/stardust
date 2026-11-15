import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { GalaxyAggregatesFaker } from '#profile/domain/aggregates/fakers/GalaxyAggregatesFaker'
import { Id } from '#global/domain/structures/Id'
import { EnterGalaxyUseCase } from '../EnterGalaxyUseCase'

describe('Enter Galaxy Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: EnterGalaxyUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new EnterGalaxyUseCase(repository)
  })

  it('should throw UserNotFoundError when the user is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: Id.create().value,
        galaxy: GalaxyAggregatesFaker.fakeDto(),
      }),
    ).rejects.toThrow(UserNotFoundError)
    expect(repository.replace).not.toHaveBeenCalled()
  })

  it('should store the galaxy as the current galaxy of the user', async () => {
    const user = UsersFaker.fake({ currentGalaxy: GalaxyAggregatesFaker.fakeDto() })
    const galaxy = GalaxyAggregatesFaker.fakeDto()
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({ userId: user.id.value, galaxy })

    expect(repository.findById).toHaveBeenCalledWith(user.id)
    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(user)
    expect(user.currentGalaxy?.id.value).toBe(galaxy.id)
    expect(response.currentGalaxy).toEqual(galaxy)
  })

  it('should store the galaxy when the user has no current galaxy', async () => {
    const user = UsersFaker.fake({ currentGalaxy: null })
    const galaxy = GalaxyAggregatesFaker.fakeDto()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({ userId: user.id.value, galaxy })

    expect(repository.replace).toHaveBeenCalledWith(user)
    expect(user.currentGalaxy?.id.value).toBe(galaxy.id)
  })

  it('should not store anything when the galaxy is already the current one', async () => {
    const galaxy = GalaxyAggregatesFaker.fakeDto()
    const user = UsersFaker.fake({ currentGalaxy: galaxy })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({ userId: user.id.value, galaxy })

    expect(repository.replace).not.toHaveBeenCalled()
    expect(response).toEqual(user.dto)
  })

  it('should keep the progress of the user unchanged', async () => {
    const user = UsersFaker.fake({
      coins: 120,
      xp: 340,
      streak: 4,
      unlockedStarsIds: [Id.create().value, Id.create().value],
    })
    const dtoBefore = user.dto
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      userId: user.id.value,
      galaxy: GalaxyAggregatesFaker.fakeDto(),
    })

    expect(response.coins).toBe(dtoBefore.coins)
    expect(response.xp).toBe(dtoBefore.xp)
    expect(response.level).toBe(dtoBefore.level)
    expect(response.streak).toBe(dtoBefore.streak)
    expect(response.unlockedStarsIds).toEqual(dtoBefore.unlockedStarsIds)
    expect(response.completedPlanetsIds).toEqual(dtoBefore.completedPlanetsIds)
  })
})
