import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateAvatarUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  routeParams: {
    avatarId: string
  }
  body: AvatarDto
}

export class UpdateAvatarController implements Controller<Schema> {
  constructor(private readonly repository: AvatarsRepository) {}

  async handle(http: Http<Schema>) {
    const { avatarId } = http.getRouteParams()
    const avatarDto = await http.getBody()
    avatarDto.id = avatarId
    const useCase = new UpdateAvatarUseCase(this.repository)
    const response = await useCase.execute({ avatarDto })
    return http.send(response)
  }
}
