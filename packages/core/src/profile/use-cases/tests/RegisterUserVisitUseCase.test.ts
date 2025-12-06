import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { Logical } from '#global/domain/structures/Logical'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { RegisterUserVisitUseCase } from '../RegisterUserVisitUseCase'

describe('Register User Visit Use Case', () => {
  let repositoryMock: Mock<UsersRepository>
  let useCase: RegisterUserVisitUseCase

  beforeEach(() => {
    repositoryMock = mock<UsersRepository>()
    repositoryMock.findById.mockImplementation()
    repositoryMock.hasVisit.mockImplementation()
    repositoryMock.addVisit.mockImplementation()

    useCase = new RegisterUserVisitUseCase(repositoryMock)
  })

  it('should throw an error if the user is not found', async () => {
    const userId = UsersFaker.fake().id.value
    repositoryMock.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId,
        platform: 'web',
      }),
    ).rejects.toThrow(UserNotFoundError)

    expect(repositoryMock.findById).toHaveBeenCalledWith(Id.create(userId))
  })

  it('should add a visit when the visit does not exist yet', async () => {
    const user = UsersFaker.fake()
    const platform = 'web'
    repositoryMock.findById.mockResolvedValue(user)
    repositoryMock.hasVisit.mockResolvedValue(Logical.create(false, 'Has visit?'))

    await useCase.execute({
      userId: user.id.value,
      platform,
    })

    expect(repositoryMock.findById).toHaveBeenCalledWith(Id.create(user.id.value))
    expect(repositoryMock.hasVisit).toHaveBeenCalled()
    expect(repositoryMock.addVisit).toHaveBeenCalled()
  })

  it('should not add a visit when the visit already exists', async () => {
    const user = UsersFaker.fake()
    const platform = 'mobile'
    repositoryMock.findById.mockResolvedValue(user)
    repositoryMock.hasVisit.mockResolvedValue(Logical.create(true, 'Has visit?'))

    await useCase.execute({
      userId: user.id.value,
      platform,
    })

    expect(repositoryMock.findById).toHaveBeenCalledWith(Id.create(user.id.value))
    expect(repositoryMock.hasVisit).toHaveBeenCalled()
    expect(repositoryMock.addVisit).not.toHaveBeenCalled()
  })
})
