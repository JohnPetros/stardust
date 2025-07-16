import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireAvatarUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    avatarId: string
    avatarName: string
    avatarImage: string
    avatarPrice: number
  }
}

export class AcquireAvatarController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const account = await http.getAccount()
    const { avatarId, avatarName, avatarImage, avatarPrice } = await http.getBody()
    const useCase = new AcquireAvatarUseCase(this.usersRepository)
    const user = await useCase.execute({
      userId: String(account.id),
      avatarId,
      avatarName,
      avatarImage,
      avatarPrice,
    })
    return http.send(user)
  }
}
