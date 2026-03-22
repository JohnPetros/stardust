import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { UpdateTextBlocksUseCase } from '@stardust/core/lesson/use-cases'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    textBlocks: TextBlockDto[]
  }
}

export class UpdateTextBlocksController implements Controller<Schema> {
  constructor(private readonly repository: TextBlocksRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { textBlocks } = await http.getBody()
    const useCase = new UpdateTextBlocksUseCase(this.repository)
    const response = await useCase.execute({ textBlocks, starId })
    return http.send(response)
  }
}
