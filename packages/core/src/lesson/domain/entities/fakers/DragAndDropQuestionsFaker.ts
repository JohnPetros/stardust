import { faker } from '@faker-js/faker'

import { DragAndDropQuestion } from '../DragAndDropQuestion'
import type { DragAndDropQuestionDto } from '../dtos'

export class DragAndDropQuestionsFaker {
  static fake(baseDto?: Partial<DragAndDropQuestionDto>): DragAndDropQuestion {
    return DragAndDropQuestion.create(DragAndDropQuestionsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<DragAndDropQuestionDto>): DragAndDropQuestionDto {
    const items =
      baseDto?.items ??
      [
        { index: 1, label: faker.lorem.word() },
        { index: 2, label: faker.lorem.word() },
      ]
    const correctItems =
      baseDto?.correctItems ?? items.map((item) => item.label ?? faker.lorem.word())

    return {
      id: baseDto?.id ?? faker.string.uuid(),
      type: 'drag-and-drop',
      stem: baseDto?.stem ?? faker.lorem.sentence(),
      picture: baseDto?.picture ?? faker.image.url(),
      lines: baseDto?.lines ?? [
        {
          number: 1,
          texts: ['const value =', 'dropZone'],
          indentation: 0,
        },
      ],
      items,
      correctItems,
    }
  }
}
