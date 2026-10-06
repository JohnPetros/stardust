import { mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { Email, Name } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import { FetchOnboardingAttemptController } from '../FetchOnboardingAttemptController'

describe('FetchOnboardingAttemptController', () => {
  const user = UsersFaker.fake()
  const attempt = {
    accountId: user.id,
    email: Email.create('attempt@example.com'),
    name: Name.create('Attempt Name'),
    expiresAt: new Date('2035-01-01'),
  }

  it.each([false, true])(
    'returns readiness %s with signed attempt data only',
    async (created) => {
      const repository = mock<UsersRepository>()
      repository.findById.mockResolvedValue(created ? user : null)
      const response = await new FetchOnboardingAttemptController(
        repository,
        attempt,
      ).handle(mock<Http>())
      expect(repository.findById).toHaveBeenCalledWith(user.id)
      expect(response.body).toEqual({
        account: {
          id: user.id.value,
          email: attempt.email.value,
          name: attempt.name.value,
        },
        expiresAt: attempt.expiresAt.toISOString(),
        isUserCreated: created,
      })
    },
  )

  it('rejects a repository result belonging to another account', async () => {
    const repository = mock<UsersRepository>()
    repository.findById.mockResolvedValue(UsersFaker.fake())
    await expect(
      new FetchOnboardingAttemptController(repository, attempt).handle(mock<Http>()),
    ).rejects.toBeInstanceOf(AuthError)
  })

  it('rejects expiration before consulting persistence', async () => {
    const repository = mock<UsersRepository>()
    await expect(
      new FetchOnboardingAttemptController(repository, {
        ...attempt,
        expiresAt: new Date(0),
      }).handle(mock<Http>()),
    ).rejects.toBeInstanceOf(AuthError)
    expect(repository.findById).not.toHaveBeenCalled()
  })
})
