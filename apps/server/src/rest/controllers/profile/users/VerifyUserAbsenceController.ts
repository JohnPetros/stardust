import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { ConflictError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

export class VerifyUserAbsenceController implements Controller {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async handle(http: Http): Promise<RestResponse> {
    const response = await this.authService.fetchAccount()
    if (response.isFailure) response.throwError()

    const account = response.body
    const user = await this.usersRepository.findById(Id.create(account.id))

    if (user) {
      throw new ConflictError('Perfil já existe para esta conta')
    }

    return http.pass()
  }
}
