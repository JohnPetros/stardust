import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UnlockStarUseCase } from '../UnlockStarUseCase'

describe('Unlock Star Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: UnlockStarUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.addUnlockedStar.mockImplementation()
    useCase = new UnlockStarUseCase(repository)
  })

  it('should throw an error if the star is not found', () => {
    const starId = Id.create()
    const userId = Id.create()
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({ starId: starId.value, userId: userId.value }),
    ).rejects.toThrow(UserNotFoundError)
    expect(repository.findById).toHaveBeenCalledWith(userId)
  })

  it('should add the star to the repository with its id and the user id', async () => {
    const user = UsersFaker.fake()
    const starId = Id.create()
    user.unlockStar = jest.fn()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({ starId: starId.value, userId: user.id.value })

    expect(repository.findById).toHaveBeenCalledWith(user.id)
    expect(repository.addUnlockedStar).toHaveBeenCalledWith(starId, user.id)
    expect(user.unlockStar).toHaveBeenCalledWith(starId)
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
