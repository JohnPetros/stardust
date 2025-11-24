import { type Mock, mock } from 'ts-jest-mocker'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { AccountsFaker } from '#auth/domain/entities/fakers/AccountsFaker'
import { VerifyUserSocialAccountUseCase } from '../VerifyUserSocialAccountUseCase'
import { UserSocialAccountAlreadyInUseError } from '#profile/domain/errors/UserSocialAccountAlreadyInUseError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { Name } from '#global/domain/structures/Name'

describe('Verify User Social Account Use Case', () => {
  let useCase: VerifyUserSocialAccountUseCase
  let repository: Mock<UsersRepository>

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findByName.mockImplementation()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new VerifyUserSocialAccountUseCase(repository)
  })

  it('should throw an error if the user is found', async () => {
    const account = AccountsFaker.fake()
    repository.findById.mockResolvedValue(UsersFaker.fake())

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
  })

  it('should throw an error if the user is found', async () => {
    const account = AccountsFaker.fake()
    repository.findById.mockResolvedValue(UsersFaker.fake())

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
  })

  it('should deduplicate the user name if the user is found', async () => {
    const user = UsersFaker.fake()
    const account = AccountsFaker.fake({ name: user.name.value })
    repository.findById.mockResolvedValue(null)
    repository.findByName.mockImplementation(async (name: Name) =>
      name.value === user.name.value ? user : null,
    )

    const result = await useCase.execute({
      socialAccountId: account.id.value,
      socialAccountName: account.name.value,
    })

    expect(repository.findByName).toHaveBeenCalledTimes(2)
    expect(repository.findByName).toHaveBeenCalledWith(user.name)
    expect(result).toEqual({ deduplicatedUserName: user.name.deduplicate().value })
  })
})
