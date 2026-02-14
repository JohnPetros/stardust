import { faker } from '@faker-js/faker'
import { TextSelection } from '../TextSelection'
import type { TextSelectionDto } from '../dtos/TextSelectionDto'

export class TextSelectionFaker {
  static fake(overrides?: Partial<TextSelectionDto>): TextSelection {
    const dto: TextSelectionDto = {
      content: faker.lorem.paragraph(),
      preview: faker.lorem.sentence(),
      ...overrides,
    }

    return TextSelection.create(dto)
  }

  static fakeMany(count: number, overrides?: Partial<TextSelectionDto>): TextSelection[] {
    return Array.from({ length: count }, () => TextSelectionFaker.fake(overrides))
  }
}
