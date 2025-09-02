import { type Mock, mock } from 'ts-jest-mocker'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { AccountsFaker } from '#auth/domain/entities/fakers/AccountsFaker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { VerifyUserSocialAccountUseCase } from '../VerifyUserSocialAccountUseCase'
import { UserSocialAccountAlreadyInUseError } from '#profile/errors/UserSocialAccountAlreadyInUseError'

describe('Verify User Social Account Use Case', () => {
  let useCase: VerifyUserSocialAccountUseCase
  let repository: Mock<UsersRepository>

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findByGoogleAccountId.mockImplementation()
    repository.findByGithubAccountId.mockImplementation()
    repository.findByEmail.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new VerifyUserSocialAccountUseCase(repository)
  })

  it('should throw an error if the google account is already in use', async () => {
    const account = AccountsFaker.fake()
    const user = UsersFaker.fake()
    repository.findByGoogleAccountId.mockResolvedValue(user)

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
  })

  it('should throw an error if the github account is already in use', async () => {
    const account = AccountsFaker.fake()
    const user = UsersFaker.fake()
    repository.findByGithubAccountId.mockResolvedValue(user)

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
  })
})
