import { AquireAvatarUseCase } from '../AquireAvatarUseCase'
import type { UsersRepository } from '../../interfaces'
import { mock, type Mock } from 'ts-jest-mocker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { AvatarAggregatesFaker } from '#profile/domain/aggregates/fakers/AvatarAggregatesFaker'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import { Integer } from '#global/domain/structures/Integer'

describe('Aquire Avatar Use Case', () => {
  let usersRepository: Mock<UsersRepository>
  let useCase: AquireAvatarUseCase

  beforeEach(() => {
    usersRepository = mock<UsersRepository>()
    usersRepository.findById.mockImplementation()
    usersRepository.replace.mockImplementation()
    usersRepository.addAcquiredAvatar.mockImplementation()
    useCase = new AquireAvatarUseCase(usersRepository)
  })

  it('should throw an error if the user is not found', () => {
    const user = UsersFaker.fake()
    const avatar = AvatarAggregatesFaker.fake()
    usersRepository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        userId: user.id.value,
        avatarId: avatar.id.value,
        avatarName: avatar.name.value,
        avatarImage: avatar.image.value,
        avatarPrice: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should add the acquire avatar to the repository', async () => {
    const user = UsersFaker.fake()
    user.buyAvatar = jest.fn()
    const avatar = AvatarAggregatesFaker.fake()
    const avatarPrice = Integer.create(0)
    usersRepository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      avatarId: avatar.id.value,
      avatarName: avatar.name.value,
      avatarImage: avatar.image.value,
      avatarPrice: 0,
    })

    expect(user.buyAvatar).toHaveBeenCalledWith(avatar, avatarPrice)
    expect(usersRepository.addAcquiredAvatar).toHaveBeenCalledWith(avatar, user.id)
  })
})
