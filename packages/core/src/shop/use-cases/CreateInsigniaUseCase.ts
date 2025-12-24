import type { InsigniaDto } from '../domain/entities/dtos'
import type { InsigniasRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { Insignia } from '../domain/entities'
import { InsigniaAlreadyExistsError } from '#shop/domain/errors/InsigniaAlreadyExistsError'

type Request = {
  insigniaDto: InsigniaDto
}

type Response = Promise<InsigniaDto>

export class CreateInsigniaUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: InsigniasRepository) {}

  async execute({ insigniaDto }: Request): Response {
    const insignia = Insignia.create(insigniaDto)
    await this.findInsigniaByRole(insignia.role)
    await this.repository.add(insignia)
    return insignia.dto
  }

  private async findInsigniaByRole(role: InsigniaRole) {
    const insignia = await this.repository.findByRole(role)
    if (insignia) throw new InsigniaAlreadyExistsError()
  }
}
