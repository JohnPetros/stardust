import { execFileSync } from 'node:child_process'

import { ENV } from '@/constants'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { InsigniaRole } from '@stardust/core/global/structures'

import { LocalSupabaseProxy } from './LocalSupabaseProxy'

export class SupabaseFixture {
  readonly supabase: SupabaseClient

  constructor() {
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

    execFileSync('psql', [
      ENV.databaseUrl,
      '-c',
      `delete from public.insignias where role = '${roleValue}';`,
    ])
  }

  private async deleteAllRowsFrom(tableName: string) {
    const { error } = await this.supabase.from(tableName).delete().not('id', 'is', null)

    if (error) {
      throw error
    }
  }
}
