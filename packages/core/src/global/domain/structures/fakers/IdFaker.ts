import { faker } from '@faker-js/faker'
import { Id } from '../Id'

export class IdFaker {
  static fake() {
    return Id.create(faker.string.uuid())
  }
}
