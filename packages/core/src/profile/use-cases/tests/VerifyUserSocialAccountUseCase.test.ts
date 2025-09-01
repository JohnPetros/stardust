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
    const account = AccountsFaker.fake({ provider: 'google' })
    const user = UsersFaker.fake()
    repository.findByGoogleAccountId.mockResolvedValue(user)

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
        socialAccountEmail: account.email.value,
        socialAccountProvider: account.provider.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
  })

  it('should throw an error if the github account is already in use', async () => {
    const account = AccountsFaker.fake({ provider: 'github' })
    const user = UsersFaker.fake()
    repository.findByGithubAccountId.mockResolvedValue(user)

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
        socialAccountEmail: account.email.value,
        socialAccountProvider: account.provider.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
  })

  it('should throw an error and set the social account id if the email is already in use and for any social account provider', async () => {
    const user = UsersFaker.fake()
    const account = AccountsFaker.fake({ provider: 'google', email: user.email.value })
    const setSocialAccountIdSpy = jest.spyOn(user, 'setSocialAccountId')
    repository.findByGoogleAccountId.mockResolvedValue(null)
    repository.findByGithubAccountId.mockResolvedValue(null)
    repository.findByEmail.mockResolvedValue(user)

    await expect(
      useCase.execute({
        socialAccountId: account.id.value,
        socialAccountName: account.name.value,
        socialAccountEmail: account.email.value,
        socialAccountProvider: account.provider.value,
      }),
    ).rejects.toThrow(UserSocialAccountAlreadyInUseError)
    expect(setSocialAccountIdSpy).toHaveBeenCalledWith(account.id, account.provider)
    expect(repository.replace).toHaveBeenCalledWith(user)
  })
})
