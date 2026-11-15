import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UpdateSpaceForAllUsersUseCase } from '../UpdateSpaceForAllUsersUseCase'
import { Id, IdFaker, IdsList, UsersFaker } from '../../../main'

describe('Update Space For All Users Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: UpdateSpaceForAllUsersUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findAll.mockImplementation()
    repository.findUnlockedStars.mockImplementation()
    repository.findRecentlyUnlockedStars.mockResolvedValue(IdsList.create())
    repository.addUnlockedStar.mockImplementation()
    repository.addRecentlyUnlockedStar.mockImplementation()
    useCase = new UpdateSpaceForAllUsersUseCase(repository)
  })

  it('should add the unlocked stars to the repository if the star is not unlocked by the user', async () => {
    const reorderedStarIds = [
      IdFaker.fake().value,
      IdFaker.fake().value,
      IdFaker.fake().value,
      IdFaker.fake().value,
    ]
    const unlockedStarIds = [reorderedStarIds[0], reorderedStarIds[3]]
    const users = UsersFaker.fakeMany(1)
    repository.findAll.mockResolvedValue(users)
    repository.findUnlockedStars.mockResolvedValue(IdsList.create(unlockedStarIds))
    repository.findRecentlyUnlockedStars.mockResolvedValue(IdsList.create())

    await useCase.execute({
      reorderedStarIds: reorderedStarIds,
    })

    expect(repository.findUnlockedStars).toHaveBeenCalledTimes(users.length)
    expect(repository.findRecentlyUnlockedStars).toHaveBeenCalledTimes(users.length)
    expect(repository.addUnlockedStar).toHaveBeenNthCalledWith(
      1,
      Id.create(reorderedStarIds[1]),
      users[0].id,
    )
    expect(repository.addUnlockedStar).toHaveBeenNthCalledWith(
      2,
      Id.create(reorderedStarIds[2]),
      users[0].id,
    )
    expect(repository.addRecentlyUnlockedStar).toHaveBeenNthCalledWith(
      1,
      Id.create(reorderedStarIds[1]),
      users[0].id,
    )
    expect(repository.addRecentlyUnlockedStar).toHaveBeenNthCalledWith(
      2,
      Id.create(reorderedStarIds[2]),
      users[0].id,
    )
  })

  it('should not add stars when the user already unlocked all reordered stars', async () => {
    const reorderedStarIds = [IdFaker.fake().value, IdFaker.fake().value]
    const users = UsersFaker.fakeMany(1)
    repository.findAll.mockResolvedValue(users)
    repository.findUnlockedStars.mockResolvedValue(IdsList.create(reorderedStarIds))

    await useCase.execute({ reorderedStarIds })

    expect(repository.findUnlockedStars).toHaveBeenCalledTimes(users.length)
    expect(repository.findRecentlyUnlockedStars).toHaveBeenCalledTimes(users.length)
    expect(repository.addUnlockedStar).not.toHaveBeenCalled()
    expect(repository.addRecentlyUnlockedStar).not.toHaveBeenCalled()
  })

  it('should not add stars that are already in the recently unlocked list', async () => {
    const reorderedStarIds = [
      IdFaker.fake().value,
      IdFaker.fake().value,
      IdFaker.fake().value,
    ]
    const unlockedStarIds = [reorderedStarIds[0], IdFaker.fake().value]
    const users = UsersFaker.fakeMany(1)
    repository.findAll.mockResolvedValue(users)
    repository.findUnlockedStars.mockResolvedValue(IdsList.create(unlockedStarIds))
    repository.findRecentlyUnlockedStars.mockResolvedValue(
      IdsList.create([reorderedStarIds[1]]),
    )

    await useCase.execute({ reorderedStarIds })

    expect(repository.findUnlockedStars).toHaveBeenCalledTimes(users.length)
    expect(repository.findRecentlyUnlockedStars).toHaveBeenCalledTimes(users.length)
    expect(repository.addUnlockedStar).not.toHaveBeenCalled()
    expect(repository.addRecentlyUnlockedStar).not.toHaveBeenCalled()
  })

  it('should consider only the unlocked stars that are in the reordered list', async () => {
    const reorderedStarIds = [
      IdFaker.fake().value,
      IdFaker.fake().value,
      IdFaker.fake().value,
    ]
    const otherGalaxyStarIds = [IdFaker.fake().value, IdFaker.fake().value]
    const users = UsersFaker.fakeMany(1)
    repository.findAll.mockResolvedValue(users)
    repository.findUnlockedStars.mockResolvedValue(
      IdsList.create([reorderedStarIds[0], reorderedStarIds[2], ...otherGalaxyStarIds]),
    )

    await useCase.execute({ reorderedStarIds })

    expect(repository.addUnlockedStar).toHaveBeenCalledTimes(1)
    expect(repository.addUnlockedStar).toHaveBeenCalledWith(
      Id.create(reorderedStarIds[1]),
      users[0].id,
    )
    expect(repository.addRecentlyUnlockedStar).toHaveBeenCalledTimes(1)
    expect(repository.addRecentlyUnlockedStar).toHaveBeenCalledWith(
      Id.create(reorderedStarIds[1]),
      users[0].id,
    )
  })

  it('should not add the stars of another galaxy', async () => {
    const reorderedStarIds = [IdFaker.fake().value, IdFaker.fake().value]
    const otherGalaxyStarIds = [
      IdFaker.fake().value,
      IdFaker.fake().value,
      IdFaker.fake().value,
    ]
    const users = UsersFaker.fakeMany(1)
    repository.findAll.mockResolvedValue(users)
    repository.findUnlockedStars.mockResolvedValue(
      IdsList.create([...reorderedStarIds, ...otherGalaxyStarIds]),
    )

    await useCase.execute({ reorderedStarIds })

    expect(repository.addUnlockedStar).not.toHaveBeenCalled()
    expect(repository.addRecentlyUnlockedStar).not.toHaveBeenCalled()
    for (const otherStarId of otherGalaxyStarIds) {
      expect(repository.addUnlockedStar).not.toHaveBeenCalledWith(
        Id.create(otherStarId),
        users[0].id,
      )
    }
  })

  it('should add nothing when the user only unlocked stars of another galaxy and the reordered list is empty', async () => {
    const users = UsersFaker.fakeMany(1)
    repository.findAll.mockResolvedValue(users)
    repository.findUnlockedStars.mockResolvedValue(
      IdsList.create([IdFaker.fake().value, IdFaker.fake().value]),
    )

    await useCase.execute({ reorderedStarIds: [] })

    expect(repository.addUnlockedStar).not.toHaveBeenCalled()
    expect(repository.addRecentlyUnlockedStar).not.toHaveBeenCalled()
  })
})
