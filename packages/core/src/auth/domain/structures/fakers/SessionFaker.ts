import { faker } from '@faker-js/faker'

import { Session } from "../Session"
import type { SessionDto } from "../dtos"
import { AccountsFaker } from "../../entities/fakers"

export class SessionFaker {
  static fake(): Session {
    return Session.create(SessionFaker.fakeDto())
  }

  static fakeDto(): SessionDto {
    return {
      account: AccountsFaker.fakeDto(),
      accessToken: faker.string.uuid(),
      refreshToken: faker.string.uuid(),
      durationInSeconds: faker.number.int(),
    }
  }
}
