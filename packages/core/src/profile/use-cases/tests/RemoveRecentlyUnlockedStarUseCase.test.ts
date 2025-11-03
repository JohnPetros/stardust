import { mock, type Mock } from 'ts-jest-mocker'

import { RemoveRecentlyUnlockedStarUseCase } from '../RemoveRecentlyUnlockedStarUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Id } from '#global/domain/structures/Id'
import { UsersFaker } from '../../../main'

describe('Remove Recently Unlocked Star Use Case', () => {
  let usersRepository: Mock<UsersRepository>
  let useCase: RemoveRecentlyUnlockedStarUseCase

  beforeEach(() => {
    usersRepository = mock<UsersRepository>()
    usersRepository.findById.mockImplementation()
    usersRepository.removeRecentlyUnlockedStar.mockImplementation()

    useCase = new RemoveRecentlyUnlockedStarUseCase(usersRepository)
  })

  it('should throw an error if the user is not found', async () => {
    usersRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ userId: 'userId', starId: 'starId' }),
    ).rejects.toThrow()
  })

  it('should remove the recently unlocked star from the repository only when the star is unlocked by the user', async () => {
    const starId = Id.create()
    let user = UsersFaker.fake({
      recentlyUnlockedStarsIds: [starId.value],
    })
    usersRepository.findById.mockResolvedValue(user)

    await useCase.execute({ userId: user.id.value, starId: starId.value })

    expect(usersRepository.removeRecentlyUnlockedStar).toHaveBeenCalledWith(
      starId,
      user.id,
    )

    user = UsersFaker.fake({
      recentlyUnlockedStarsIds: [],
    })
    usersRepository.findById.mockResolvedValue(user)

    await useCase.execute({ userId: user.id.value, starId: starId.value })

    expect(usersRepository.removeRecentlyUnlockedStar).not.toHaveBeenCalledWith(
      starId,
      user.id,
    )
  })
})
