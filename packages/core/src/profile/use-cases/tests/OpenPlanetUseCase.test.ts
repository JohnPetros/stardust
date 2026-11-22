import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { OpenPlanetUseCase } from '../OpenPlanetUseCase'

describe('Open Planet Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: OpenPlanetUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.addOpenedPlanet.mockResolvedValue()
    useCase = new OpenPlanetUseCase(repository)
  })

  it('should throw when the user is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ userId: Id.create().value, planetId: Id.create().value }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should add the opened planet once', async () => {
    const user = UsersFaker.fake({ openedPlanetsIds: [] })
    repository.findById.mockResolvedValue(user)
    const planetId = Id.create()

    const response = await useCase.execute({
      userId: user.id.value,
      planetId: planetId.value,
    })

    expect(response).toEqual({ openedPlanetId: planetId.value })
    expect(repository.addOpenedPlanet).toHaveBeenCalledTimes(1)
    expect(repository.addOpenedPlanet).toHaveBeenCalledWith(planetId, user.id)
  })

  it('should not write again when the planet was already opened', async () => {
    const planetId = Id.create()
    const user = UsersFaker.fake({ openedPlanetsIds: [planetId.value] })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      userId: user.id.value,
      planetId: planetId.value,
    })

    expect(response).toEqual({ openedPlanetId: planetId.value })
    expect(repository.addOpenedPlanet).not.toHaveBeenCalled()
  })
})
