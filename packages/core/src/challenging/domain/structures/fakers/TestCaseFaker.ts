import { faker } from '@faker-js/faker'

import { TestCase } from '../TestCase'
import type { TestCaseDto } from '../../entities/dtos'

export class TestCaseFaker {
  static fake(baseDto: Partial<TestCaseDto>) {
    return TestCase.create({
      position: faker.number.int({ min: 1, max: 100 }),
      isLocked: faker.datatype.boolean(),
      inputs: [],
      expectedOutput: '',
      ...baseDto,
    })
  }
}
