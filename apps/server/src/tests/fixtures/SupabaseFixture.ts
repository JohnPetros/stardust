import { execFileSync } from 'node:child_process'

import { ENV } from '@/constants'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { InsigniaRole } from '@stardust/core/global/structures'

import { LocalSupabaseProxy } from './LocalSupabaseProxy'

export const LOCAL_CATALOG_AUTHOR_ID = '4e6f5a91-4d69-4b5e-9c3e-0f8e6d2a1b7c'
export const LOCAL_CATALOG_AVATAR_ID = '6d27f2d0-3b50-4f86-9d65-9a9d3f1c2b7e'

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
    await this.deleteAllRowsFrom('users', LOCAL_CATALOG_AUTHOR_ID)
    await this.deleteAllRowsFrom('achievements')
    await this.deleteAllRowsFrom('insignias')
    await this.deleteAllRowsFrom('avatars', LOCAL_CATALOG_AVATAR_ID)
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

  private async deleteAllRowsFrom(tableName: string, preservedId?: string) {
    let query = this.supabase.from(tableName).delete().not('id', 'is', null)
    if (preservedId) query = query.neq('id', preservedId)

    const { error } = await query

    if (error) {
      throw error
    }
  }
}
