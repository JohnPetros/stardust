import { Id, Text } from '#global/domain/structures/index'

import type { AnalyticsEventDto } from '../entities/dtos'

export class AnalyticsEvent {
  private constructor(
    readonly name: Text,
    readonly distinctId: Id | Text,
    readonly insertId: Text,
    readonly properties: Record<string, unknown>,
  ) {}

  static create(dto: AnalyticsEventDto) {
    return new AnalyticsEvent(
      Text.create(dto.name, 'Analytics event name'),
      AnalyticsEvent.createDistinctId(dto.distinctId),
      Text.create(dto.insertId, 'Analytics event insert ID'),
      dto.properties ?? {},
    )
  }

  private static createDistinctId(value: string) {
    try {
      return Id.create(value)
    } catch {
      return Text.create(value, 'Analytics event distinct ID')
    }
  }

  get dto(): AnalyticsEventDto {
    return {
      name: this.name.value,
      distinctId: this.distinctId.value,
      insertId: this.insertId.value,
      properties: this.properties,
    }
  }
}
