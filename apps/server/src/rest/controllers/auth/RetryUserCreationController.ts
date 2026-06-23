import type { Controller, Broker } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { AppError } from '@stardust/core/global/errors'
import { AccountSignedUpEvent } from '@stardust/core/auth/events'

export class RetryUserCreationController implements Controller {
  constructor(
    private readonly authService: AuthService,
    private readonly broker: Broker,
  ) {}

  async handle(_: Http): Promise<RestResponse> {
    const response = await this.authService.fetchAccount()
    if (response.isFailure) response.throwError()

    const account = response.body
    if (!account.id) throw new AppError('Account ID is required')

    const accountName =
      account.name !== '' ? account.name : this.getFallbackAccountName(account.email)

    const event = new AccountSignedUpEvent({
      accountId: account.id,
      accountName,
      accountEmail: account.email,
    })

    await this.broker.publish(event)

    return response
  }

  private getFallbackAccountName(email: string): string {
    const [emailLocalPart] = email.split('@')
    return emailLocalPart || 'stardust-user'
  }
}
