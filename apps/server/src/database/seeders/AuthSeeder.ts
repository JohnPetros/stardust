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
      await this.sql`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password,
          email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
          created_at, updated_at, confirmation_token, recovery_token,
          email_change, email_change_token_new, email_change_token_current
        ) VALUES (
          '00000000-0000-0000-0000-000000000000', ${account.id},
          'authenticated', 'authenticated', ${account.email},
          extensions.crypt(${account.password}, extensions.gen_salt('bf')),
          now(), '{"provider":"email","providers":["email"]}'::jsonb,
          ${JSON.stringify({ name: account.name })}::text::jsonb, now(), now(), '', '', '', '', ''
        )`
      await this.sql`
        INSERT INTO auth.identities (
          id, provider_id, user_id, identity_data, provider, created_at, updated_at
        ) VALUES (
          ${account.id}, ${account.id}, ${account.id},
          ${JSON.stringify({ sub: account.id, email: account.email, email_verified: true })}::text::jsonb,
          'email', now(), now()
        )`
    }
  }
}
