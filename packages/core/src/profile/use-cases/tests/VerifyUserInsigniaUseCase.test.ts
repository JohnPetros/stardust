import { type Mock, mock } from 'ts-jest-mocker'

import { VerifyUserInsigniaUseCase } from '../VerifyUserInsigniaUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { InsigniaNotIncludedError } from '#profile/domain/errors/index'

describe('Verify User Insignia Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: VerifyUserInsigniaUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.addCompletedChallenge.mockImplementation()
    useCase = new VerifyUserInsigniaUseCase(repository)
  })

  it('should throw an error if the user does not have the insignia', () => {
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        userId: Id.create().value,
        insigniaRole: InsigniaRole.createAsEngineer().value,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should throw an error if the user does not have the insignia', async () => {
    let user = UsersFaker.fake({
      insigniaRoles: [],
    })
    repository.findById.mockResolvedValue(user)
    const insignia = InsigniaRole.createAsEngineer()

    expect(
      useCase.execute({
        userId: user.id.value,
        insigniaRole: insignia.value,
      }),
    ).rejects.toThrow(InsigniaNotIncludedError)

    user = UsersFaker.fake({
      insigniaRoles: [insignia.value],
    })
    repository.findById.mockResolvedValue(user)

    expect(
      useCase.execute({
        userId: user.id.value,
        insigniaRole: insignia.value,
      }),
    ).resolves.not.toThrow()
  })
})
