import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireRocketUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    rocketId: string
    rocketName: string
    rocketImage: string
    rocketPrice: number
  }
}

export class AcquireRocketController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const account = await http.getAccount()
    const { rocketId, rocketName, rocketImage, rocketPrice } = await http.getBody()
    const useCase = new AcquireRocketUseCase(this.usersRepository)
    const user = await useCase.execute({
      userId: String(account.id),
      rocketId,
      rocketName,
      rocketImage,
      rocketPrice,
    })
    return http.send(user)
  }
}
