import { Entity } from '#global/domain/abstracts/Entity'
import { Email } from '#global/domain/structures/Email'
import { Logical } from '#global/domain/structures/Logical'
import { Name } from '#global/domain/structures/Name'
import type { AccountDto } from './dtos'

type Props = {
  name: Name
  email: Email
  isAuthenticated: Logical
}

export class Account extends Entity<Props> {
  static create(dto: AccountDto): Account {
    return new Account(
      {
        email: Email.create(dto.email),
        name: Name.create(dto.name ?? 'não definido'),
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

  get name(): Name {
    return this.props.name
  }

  get dto(): AccountDto {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      isAuthenticated: this.isAuthenticated.value,
    }
  }
}
