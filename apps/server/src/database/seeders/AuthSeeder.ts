const AUTH_USER_INSERT = `INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change, email_change_token_new, email_change_token_current
) VALUES (
  '00000000-0000-0000-0000-000000000000', $1,
  'authenticated', 'authenticated', $2,
  extensions.crypt($3, extensions.gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}'::jsonb,
  $4::text::jsonb, now(), now(), '', '', '', '', ''
)`

import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'
import type { ModuleSeed } from './ModuleSeeder'
import type { TransactionSql } from 'postgres'
import type { SeedAccount } from './seed-config'

export class AuthSeeder extends ModuleSeeder {
  constructor(
    database: SeedDatabase,
    private readonly sql: TransactionSql,
    private readonly accounts: SeedAccount[],
  ) {
    super(database, ['api_keys'])
  }

  async clear(): Promise<void> {
    await super.clear()
    await this.sql`DELETE FROM auth.users`
  }

  async run(seed: ModuleSeed = {}): Promise<void> {
    await super.run(seed)
    for (const account of this.accounts) {
      await this.insertUser(account)
      await this.insertIdentity(account)
    }
  }

  private async insertUser(account: SeedAccount) {
    await this.sql.unsafe(AUTH_USER_INSERT, this.userParameters(account))
  }

  private userParameters(account: SeedAccount) {
    return [account.id, account.email, account.password, this.userMetadata(account)]
  }

  private async insertIdentity(account: SeedAccount) {
    await this.sql`
        INSERT INTO auth.identities (
          id, provider_id, user_id, identity_data, provider, created_at, updated_at
        ) VALUES (
          ${account.id}, ${account.id}, ${account.id},
          ${this.identityMetadata(account)}::text::jsonb,
          'email', now(), now()
        )`
  }

  private userMetadata(account: SeedAccount) {
    return JSON.stringify({ name: account.name })
  }
  private identityMetadata(account: SeedAccount) {
    return JSON.stringify({ sub: account.id, email: account.email, email_verified: true })
  }
}
