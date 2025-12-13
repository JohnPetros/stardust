import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateAvatarUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  body: AvatarDto
}

export class CreateAvatarController implements Controller<Schema> {
  constructor(private readonly repository: AvatarsRepository) {}

  async handle(http: Http<Schema>) {
    const avatarDto = await http.getBody()
    const useCase = new CreateAvatarUseCase(this.repository)
    const response = await useCase.execute({ avatarDto })
    return http.statusCreated().send(response)
  }
}
