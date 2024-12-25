import { faker } from '@faker-js/faker'
import { DraggableItem } from '../../DraggableItem'
import type { DragglableItemDto } from '#lesson/dtos'

export class DraggableItemsFaker {
  static fake(baseDto?: Partial<DragglableItemDto>): DraggableItem {
    return DraggableItem.create(DraggableItemsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<DragglableItemDto>): DragglableItemDto {
    return {
      index: faker.number.int({ min: 0, max: 99 }),
      label: faker.string.sample({ min: 1, max: 5 }),
      dropZoneIndex: faker.number.int({ min: 0, max: 99 }),
      originalDropZoneIndex: faker.number.int({ min: 0, max: 99 }),
      ...baseDto,
    }
  }

  static fakeMany(count?: number, baseDto?: Partial<DragglableItemDto>): DraggableItem[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      DraggableItemsFaker.fake(baseDto),
    )
  }

  static fakeManyDto(
    count?: number,
    baseDto?: Partial<DragglableItemDto>,
  ): DragglableItemDto[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      DraggableItemsFaker.fakeDto(baseDto),
    )
  }
}
