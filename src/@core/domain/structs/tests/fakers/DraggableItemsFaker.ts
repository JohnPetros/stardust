import { faker } from '@faker-js/faker'
import type { DragglableItemDTO } from '@/@core/dtos'
import { DraggableItem } from '../../DraggableItem'

export class DraggableItemsFaker {
  static fake(baseDTO?: Partial<DragglableItemDTO>): DraggableItem {
    return DraggableItem.create(DraggableItemsFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<DragglableItemDTO>): DragglableItemDTO {
    return {
      index: faker.number.int({ min: 0, max: 99 }),
      label: faker.string.sample({ min: 1, max: 5 }),
      dropZoneIndex: faker.number.int({ min: 0, max: 99 }),
      originalDropZoneIndex: faker.number.int({ min: 0, max: 99 }),
      ...baseDTO,
    }
  }

  static fakeMany(count?: number, baseDTO?: Partial<DragglableItemDTO>): DraggableItem[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      DraggableItemsFaker.fake(baseDTO),
    )
  }

  static fakeManyDTO(
    count?: number,
    baseDTO?: Partial<DragglableItemDTO>,
  ): DragglableItemDTO[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      DraggableItemsFaker.fakeDTO(baseDTO),
    )
  }
}
