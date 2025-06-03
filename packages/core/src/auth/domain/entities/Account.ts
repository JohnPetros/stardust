import { Entity } from '#global/domain/abstracts/Entity'
import { Email } from '#global/domain/structures/Email'
import { Logical } from '#global/domain/structures/Logical'
import type { AccountDto } from './dtos'

type Props = {
  email: Email
  isAuthenticated: Logical
}

export class Account extends Entity<Props> {
  static create(dto: AccountDto): Account {
    console.log('dto', dto)
    return new Account(
      {
        email: Email.create(dto.email),
        isAuthenticated: Logical.create(dto.isAuthenticated),
      },
      dto.id,
    )
  }

  get isAuthenticated(): Logical {
    return this.props.isAuthenticated
  }

  get email(): Email {
    return this.props.email
  }
}
