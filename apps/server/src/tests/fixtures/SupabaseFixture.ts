import { execFileSync } from 'node:child_process'

import { ENV } from '@/constants'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { sql } from 'drizzle-orm'
import { DrizzleClient, type DrizzleDatabase } from '@/database/drizzle/DrizzleClient'
import type { Id, InsigniaRole } from '@stardust/core/global/structures'

import { LocalSupabaseProxy } from './LocalSupabaseProxy'

export class SupabaseFixture {
  readonly supabase: SupabaseClient
  readonly database: DrizzleDatabase

  constructor() {
    this.database = DrizzleClient.create(ENV.databaseUrl)
    this.supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  async clearDatabase() {
    await LocalSupabaseProxy.ensureRunning()
    await this.deleteAllRowsFrom('users')
    await this.deleteAllRowsFrom('achievements')
    await this.deleteAllRowsFrom('insignias')
    await this.deleteAllRowsFrom('avatars')
    await this.deleteAllRowsFrom('rockets')
    await this.deleteAllRowsFrom('tiers')
  }

  deleteInsigniaByRole(role: string | InsigniaRole) {
    const roleValue = typeof role === 'string' ? role : role.value

    execFileSync(
      'psql',
      [ENV.databaseUrl, '-v', 'ON_ERROR_STOP=1', '-v', `role=${roleValue}`],
      {
        input: "delete from public.insignias where role = :'role';\n",
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    )
  }

  async setAuthMetadata(
    accountId: Id,
    input: {
      userMetadata: Record<string, unknown>
      identities: Array<{
        provider: 'google' | 'github'
        identityData: Record<string, unknown>
        createdAt: Date
        lastSignInAt: Date | null
      }>
    },
  ): Promise<void> {
    if (ENV.mode === 'production') throw new Error('Metadata fixture is local only')
    await this.database.transaction(async (transaction) => {
      await transaction.execute(
        sql`UPDATE auth.users SET raw_user_meta_data = ${JSON.stringify(input.userMetadata)}::jsonb WHERE id = ${accountId.value}::uuid`,
      )
      await transaction.execute(
        sql`DELETE FROM auth.identities WHERE user_id = ${accountId.value}::uuid AND provider IN ('google', 'github')`,
      )
      for (const identity of input.identities) {
        const providerId = String(identity.identityData.sub ?? accountId.value)
        await transaction.execute(
          sql`INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, created_at, updated_at, last_sign_in_at) VALUES (gen_random_uuid(), ${accountId.value}::uuid, ${providerId}, ${identity.provider}, ${JSON.stringify(identity.identityData)}::jsonb, ${identity.createdAt.toISOString()}, ${identity.createdAt.toISOString()}, ${identity.lastSignInAt?.toISOString() ?? null})`,
        )
      }
    })
  }

  private async deleteAllRowsFrom(tableName: string) {
    const allowed = ['users', 'achievements', 'insignias', 'avatars', 'rockets', 'tiers']
    if (!allowed.includes(tableName)) throw new Error('Unsupported local fixture table')
    await this.database.execute(
      sql`DELETE FROM ${sql.identifier('public')}.${sql.identifier(tableName)}`,
    )
  }
}
