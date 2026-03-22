import { faker } from '@faker-js/faker'

import type { TextBlockDto } from '../../../../global/domain/entities/dtos'
import { TextBlock } from '../../../../global/domain/structures'

const TEXT_BLOCK_TYPES: TextBlockDto['type'][] = [
  'default',
  'alert',
  'quote',
  'user',
  'code',
  'image',
]

export class TextBlocksFaker {
  static fake(baseDto?: Partial<TextBlockDto>): TextBlock {
    return TextBlock.create(TextBlocksFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<TextBlockDto>): TextBlockDto {
    const type = baseDto?.type ?? faker.helpers.arrayElement(TEXT_BLOCK_TYPES)
    const canHavePicture = ['default', 'alert', 'quote', 'image'].includes(type)

    return {
      type,
      content: baseDto?.content ?? faker.lorem.sentences(2),
      title: baseDto?.title ?? faker.lorem.words(3),
      picture: canHavePicture
        ? (baseDto?.picture ?? `${faker.system.fileName()}.jpg`)
        : undefined,
      isRunnable:
        type === 'code' ? (baseDto?.isRunnable ?? faker.datatype.boolean()) : undefined,
    }
  }

  static fakeMany(count?: number): TextBlock[] {
    return Array.from({ length: count ?? 10 }).map(() => TextBlocksFaker.fake())
  }

  static fakeManyDto(count?: number, baseDto?: Partial<TextBlockDto>): TextBlockDto[] {
    return Array.from({ length: count ?? 10 }).map(() => TextBlocksFaker.fakeDto(baseDto))
  }
}
