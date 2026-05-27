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
    await this.supabase.from('users').delete()
    await this.supabase.from('achievements').delete()
    await this.supabase.from('insignias').delete()
    await this.supabase.from('avatars').delete()
    await this.supabase.from('rockets').delete()
    await this.supabase.from('tiers').delete()
  }

  deleteInsigniaByRole(role: string | InsigniaRole) {
    const roleValue = typeof role === 'string' ? role : role.value

    execFileSync('psql', [
      ENV.databaseUrl,
      '-c',
      `delete from public.insignias where role = '${roleValue}';`,
    ])
  }
}
