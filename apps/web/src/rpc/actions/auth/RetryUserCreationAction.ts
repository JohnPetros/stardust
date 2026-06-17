import type { AuthService } from '@stardust/core/auth/interfaces'
import { AccountSignedUpEvent } from '@stardust/core/auth/events'
import { AppError } from '@stardust/core/global/errors'
import type { Action, Broker, Call } from '@stardust/core/global/interfaces'

function getFallbackAccountName(email: string) {
  const [emailLocalPart] = email.split('@')

  return emailLocalPart || 'stardust-user'
}

export const RetryUserCreationAction = (
  authService: AuthService,
  broker: Broker,
): Action<void, void> => {
  return {
    async handle(_call: Call<void>) {
      const response = await authService.fetchAccount()
      if (response.isFailure) response.throwError()

      const account = response.body
      if (!account.id) throw new AppError('Account ID is required')

      const event = new AccountSignedUpEvent({
        accountId: account.id,
        accountName:
          account.name !== '' ? account.name : getFallbackAccountName(account.email),
        accountEmail: account.email,
      })

      await broker.publish(event)
    },
  }
}
