import { faker } from '@faker-js/faker'
import type { DropZoneDTO } from '@/@core/dtos'
import { DropZone } from '../../DropZone'

export class DropZoneFaker {
  static fake(baseDTO?: Partial<DropZoneDTO>): DropZone {
    return DropZone.create(DropZoneFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<DropZoneDTO>): DropZoneDTO {
    return {
      index: faker.number.int({ min: 0, max: 99 }),
      type: faker.helpers.arrayElement(['zone', 'bank']),
      hasItem: false,
      ...baseDTO,
    }
  }
}
