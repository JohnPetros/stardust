import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireInsigniaUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    insigniaRole: string
    insigniaPrice: number
  }
}

export class AcquireInsigniaController implements Controller<Schema> {
  constructor(private readonly repository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const account = await http.getAccount()
    const { insigniaRole, insigniaPrice } = await http.getBody()
    const useCase = new AcquireInsigniaUseCase(this.repository)
    const user = await useCase.execute({
      userId: String(account.id),
      insigniaRole,
      insigniaPrice,
    })
    return http.send(user)
  }
}
