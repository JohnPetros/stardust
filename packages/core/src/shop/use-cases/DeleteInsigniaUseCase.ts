import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { InsigniaNotFoundError } from '../domain/errors'
import type { InsigniasRepository } from '../interfaces'

type Request = {
  insigniaId: string
}

type Response = Promise<void>

export class DeleteInsigniaUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: InsigniasRepository) {}

  async execute({ insigniaId }: Request): Response {
    const insignia = await this.findInsignia(Id.create(insigniaId))
    await this.repository.remove(insignia.id)
  }

  private async findInsignia(insigniaId: Id) {
    const insignia = await this.repository.findById(insigniaId)
    if (!insignia) throw new InsigniaNotFoundError()
    return insignia
  }
}
