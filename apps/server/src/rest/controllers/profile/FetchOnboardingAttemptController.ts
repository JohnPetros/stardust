import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type { Email, Id, Name } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'

type Attempt = { accountId: Id; email: Email; name: Name; expiresAt: Date }
type Body = {
  account: { id: string; email: string; name: string }
  expiresAt: string
  isUserCreated: boolean
}

export class FetchOnboardingAttemptController implements Controller {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly attempt: Attempt,
  ) {}

  async handle(_http: Http): Promise<RestResponse<Body>> {
    const user = await this.resolveUser()
    return new RestResponse({
      body: {
        account: {
          id: this.attempt.accountId.value,
          email: this.attempt.email.value,
          name: this.attempt.name.value,
        },
        expiresAt: this.attempt.expiresAt.toISOString(),
        isUserCreated: user !== null,
      },
    })
  }

  private async resolveUser() {
    if (this.attempt.expiresAt.getTime() <= Date.now())
      throw new AuthError('Tentativa de cadastro expirada')
    const user = await this.usersRepository.findById(this.attempt.accountId)
    if (user && user.id.value !== this.attempt.accountId.value)
      throw new AuthError('Tentativa de cadastro inválida')
    return user
  }
}
