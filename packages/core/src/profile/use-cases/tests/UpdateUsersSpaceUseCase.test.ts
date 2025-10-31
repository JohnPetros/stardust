import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { mock, type Mock } from 'ts-jest-mocker'
import { UpdateSpaceForAllUsersUseCase } from '../UpdateSpaceForAllUsersUseCase'
import { Id, IdFaker, IdsList, UsersFaker } from '../../../main'

describe('Update Space For All Users Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: UpdateSpaceForAllUsersUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findAll.mockImplementation()
    repository.findUnlockedStars.mockImplementation()
    repository.addUnlockedStar.mockImplementation()
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

    await useCase.execute({
      reorderedStarIds: reorderedStarIds,
    })

    expect(repository.findUnlockedStars).toHaveBeenCalledTimes(users.length)
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
  })
})
