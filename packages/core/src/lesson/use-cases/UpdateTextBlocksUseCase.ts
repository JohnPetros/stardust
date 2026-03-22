import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import type { UseCase } from '#global/interfaces/UseCase'

import { Id, TextBlock } from '#global/domain/structures/index'
import type { TextBlocksRepository } from '../interfaces'

type Request = {
  starId: string
  textBlocks: TextBlockDto[]
}

type Response = Promise<TextBlockDto[]>

export class UpdateTextBlocksUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: TextBlocksRepository) {}

  async execute(request: Request) {
    const textBlocks = request.textBlocks.map(TextBlock.create)
    await this.repository.updateMany(textBlocks, Id.create(request.starId))
    return textBlocks.map((textBlock) => textBlock.dto)
  }
}
