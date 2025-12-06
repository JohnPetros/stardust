import type { VisitDto } from '../entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { Platform } from './Platform'

export class Visit {
  private constructor(
    readonly userId: Id,
    readonly platform: Platform,
    readonly createdAt: Date,
  ) {}

  static create(dto: VisitDto) {
    return new Visit(
      Id.create(dto.userId),
      Platform.create(dto.platform),
      new Date(dto.createdAt),
    )
  }

  get dto(): VisitDto {
    return {
      userId: this.userId.value,
      platform: this.platform.name,
      createdAt: this.createdAt,
    }
  }
}
