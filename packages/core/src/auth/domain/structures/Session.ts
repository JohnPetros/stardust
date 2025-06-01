import { Integer, Text } from '#global/domain/structures/index'
import { Account } from '../entities'

import type { SessionDto } from './dtos'

export class Session {
  private constructor(
    readonly account: Account,
    readonly accessToken: Text,
    readonly refreshToken: Text,
    readonly durationInSeconds: Integer,
  ) {}

  static create(dto: SessionDto): Session {
    return new Session(
      Account.create(dto.account),
      Text.create(dto.accessToken),
      Text.create(dto.refreshToken),
      Integer.create(dto.durationInSeconds),
    )
  }
}
