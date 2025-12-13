import type { InsigniaDto } from '../domain/entities/dtos'
import type { UseCase } from '#global/interfaces/UseCase'
import type { InsigniasRepository } from '../interfaces'
import type { Id } from '#global/domain/structures/Id'
import type { InsigniaRole } from '#global/domain/structures/index'
import { Insignia } from '../domain/entities'
import { InsigniaAlreadyExistsError } from '#shop/domain/errors/InsigniaAlreadyExistsError'
import { InsigniaNotFoundError } from '#shop/domain/errors/InsigniaNotFoundError'

type Request = {
  insigniaDto: InsigniaDto
}

type Response = Promise<InsigniaDto>

export class UpdateInsigniaUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: InsigniasRepository) {}

  async execute({ insigniaDto }: Request): Response {
    const insignia = Insignia.create(insigniaDto)
    const existingInsignia = await this.findInsigniaById(insignia.id)
    if (existingInsignia.role.value !== insignia.role.value) {
      await this.findInsigniaByRole(insignia.role)
    }
    await this.repository.replace(insignia)
    return insignia.dto
  }

  private async findInsigniaById(insigniaId: Id) {
    const insignia = await this.repository.findById(insigniaId)
    if (!insignia) throw new InsigniaNotFoundError()
    return insignia
  }

  private async findInsigniaByRole(role: InsigniaRole) {
    const insignia = await this.repository.findByRole(role)
    if (insignia) throw new InsigniaAlreadyExistsError()
  }
}
