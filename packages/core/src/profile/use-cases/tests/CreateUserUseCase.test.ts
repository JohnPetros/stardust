import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { Logical } from '#global/domain/structures/Logical'
import { UserEmailAlreadyInUseError } from '#profile/domain/errors/UserEmailAlreadyInUseError'
import { UserNameAlreadyInUseError } from '#profile/domain/errors/UserNameAlreadyInUseError'
import { User } from '#profile/domain/entities/index'
import { CreateUserUseCase } from '../CreateUserUseCase'

describe('Create User Use Case', () => {
  let repositoryMock: Mock<UsersRepository>
  let useCase: CreateUserUseCase

  beforeAll(() => {
    repositoryMock = mock<UsersRepository>()
    repositoryMock.findByName.mockImplementation()
    repositoryMock.findByEmail.mockImplementation()
    repositoryMock.add.mockImplementation()

    useCase = new CreateUserUseCase(repositoryMock)
  })

  it('should throw an error if the given user email is already in use', () => {
    const dto = UsersFaker.fakeDto()
    repositoryMock.findByEmail.mockResolvedValue(UsersFaker.fake())

    expect(
      useCase.execute({
        userId: String(dto.id),
        userEmail: dto.email,
        userName: dto.name,
        firstTierId: dto.tier.id,
        selectedAvatarByDefaultId: dto.avatar.id,
        selectedRocketByDefaultId: dto.rocket.id,
      }),
    ).rejects.toThrow(UserEmailAlreadyInUseError)
  })

  it('should throw an error if the given user name is already in use', () => {
    const dto = UsersFaker.fakeDto()
    repositoryMock.findByEmail.mockResolvedValue(null)
    repositoryMock.findByName.mockResolvedValue(UsersFaker.fake())

    expect(
      useCase.execute({
        userId: String(dto.id),
        userEmail: dto.email,
        userName: dto.name,
        firstTierId: dto.tier.id,
        selectedAvatarByDefaultId: dto.avatar.id,
        selectedRocketByDefaultId: dto.rocket.id,
      }),
    ).rejects.toThrow(UserNameAlreadyInUseError)
  })

  it('should create a user with the given request data', async () => {
    const dto = UsersFaker.fakeDto()
    let addedUser: User | undefined
    repositoryMock.findByEmail.mockResolvedValue(null)
    repositoryMock.findByName.mockResolvedValue(null)
    repositoryMock.add.mockImplementation(async (user) => {
      addedUser = user
    })

    await useCase.execute({
      userId: String(dto.id),
      userEmail: dto.email,
      userName: dto.name,
      firstTierId: dto.tier.id,
      selectedAvatarByDefaultId: dto.avatar.id,
      selectedRocketByDefaultId: dto.rocket.id,
    })

    const user = User.create(dto)
    expect(addedUser?.id).toEqual(user.id)
    expect(addedUser?.email).toEqual(user.email)
    expect(addedUser?.name).toEqual(user.name)
  })
})
