import { faker } from '@faker-js/faker'
import { CodeSelection } from '../CodeSelection'
import type { CodeSelectionDto } from '../dtos/CodeSelectionDto'

export class CodeSelectionFaker {
  static fake(overrides?: Partial<CodeSelectionDto>): CodeSelection {
    const startLine = faker.number.int({ min: 1, max: 80 })
    const endLine = faker.number.int({ min: startLine, max: startLine + 10 })
    const dto: CodeSelectionDto = {
      content: faker.lorem.paragraphs({ min: 1, max: 2 }),
      startLine,
      endLine,
      ...overrides,
    }

    return CodeSelection.create(dto)
  }

  static fakeMany(count: number, overrides?: Partial<CodeSelectionDto>): CodeSelection[] {
    return Array.from({ length: count }, () => CodeSelectionFaker.fake(overrides))
  }
}
