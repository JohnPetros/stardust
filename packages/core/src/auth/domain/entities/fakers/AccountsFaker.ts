import { faker } from '@faker-js/faker'

import { Account } from '../Account'
import type { AccountDto } from '../dtos'

export class AccountsFaker {
  static fake(baseDto?: Partial<AccountDto>): Account {
    return Account.create(AccountsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AccountDto>): AccountDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      isAuthenticated: faker.datatype.boolean(),
      ...baseDto,
    }
  }
}
