import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import { DeleteAvatarUseCase } from '@stardust/core/shop/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    avatarId: string
  }
}

export class DeleteAvatarController implements Controller<Schema> {
  constructor(private readonly repository: AvatarsRepository) {}

  async handle(http: Http<Schema>) {
    const { avatarId } = http.getRouteParams()
    const useCase = new DeleteAvatarUseCase(this.repository)
    await useCase.execute({ avatarId })
    return http.statusNoContent().send()
  }
}
