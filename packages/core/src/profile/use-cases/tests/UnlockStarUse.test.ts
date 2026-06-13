import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { StarUnlockedEvent } from '#profile/domain/events/StarUnlockedEvent'
import { UnlockStarUseCase } from '../UnlockStarUseCase'

describe('Unlock Star Use Case', () => {
  let broker: Mock<Broker>
  let repository: Mock<UsersRepository>
  let useCase: UnlockStarUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.addUnlockedStar.mockImplementation()
    useCase = new UnlockStarUseCase(repository, broker)
  })

  it('should throw an error if the star is not found', async () => {
    const starId = Id.create()
    const userId = Id.create()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ starId: starId.value, userId: userId.value }),
    ).rejects.toThrow(UserNotFoundError)
    expect(repository.findById).toHaveBeenCalledWith(userId)
    expect(repository.addUnlockedStar).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should add the unlocked star id and user id to the repository', async () => {
    const user = UsersFaker.fake()
    const starId = Id.create()
    user.unlockStar = jest.fn()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({ starId: starId.value, userId: user.id.value })

    expect(repository.addUnlockedStar).toHaveBeenCalledWith(starId, user.id)
    expect(user.unlockStar).toHaveBeenCalledWith(starId)
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<StarUnlockedEvent>({
        name: StarUnlockedEvent._NAME,
        payload: {
          userId: user.id.value,
          starId: starId.value,
        },
      }),
    )
  })

  it('should not add the unlocked star id and user id to the repository if the star is already unlocked', async () => {
    const starId = Id.create()
    const user = UsersFaker.fake({ unlockedStarsIds: [starId.value] })
    user.unlockStar = jest.fn()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({ starId: starId.value, userId: user.id.value })

    expect(repository.addUnlockedStar).not.toHaveBeenCalledWith(starId, user.id)
    expect(user.unlockStar).not.toHaveBeenCalledWith(starId)
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should return the user dto with the star unlocked', async () => {
    const user = UsersFaker.fake()
    const starId = Id.create()
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      starId: starId.value,
      userId: user.id.value,
    })

    expect(response).toEqual(user.dto)
  })
})
