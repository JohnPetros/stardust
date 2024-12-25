import { faker } from '@faker-js/faker'
import { DropZone } from '../../DropZone'
import type { DropZoneDto } from '#lesson/dtos'

export class DropZoneFaker {
  static fake(baseDto?: Partial<DropZoneDto>): DropZone {
    return DropZone.create(DropZoneFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<DropZoneDto>): DropZoneDto {
    return {
      index: faker.number.int({ min: 0, max: 99 }),
      type: faker.helpers.arrayElement(['zone', 'bank']),
      hasItem: false,
      ...baseDto,
    }
  }
}
