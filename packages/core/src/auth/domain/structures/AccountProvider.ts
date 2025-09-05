import { ValidationError } from '#global/domain/errors/ValidationError'
import { Logical } from '#global/domain/structures/Logical'

type AccountProviderValue = 'google' | 'github' | 'email'

export class AccountProvider {
  private constructor(readonly value: AccountProviderValue) {}

  static create(value?: string): AccountProvider {
    if (!value) return new AccountProvider('email')

    if (!AccountProvider.isAuthProviderValue(value)) {
      throw new ValidationError([
        {
          name: 'account-provider',
          messages: ['Fornecedor de conta deve ser google, github ou email'],
        },
      ])
    }

    return new AccountProvider(value)
  }

  static createAsEmail(): AccountProvider {
    return new AccountProvider('email')
  }

  get isGoogleProvider(): Logical {
    return Logical.create(this.value === 'google')
  }

  get isGithubProvider(): Logical {
    return Logical.create(this.value === 'github')
  }

  private static isAuthProviderValue(value: string): value is AccountProviderValue {
    return ['google', 'github', 'email'].includes(value)
  }
}
