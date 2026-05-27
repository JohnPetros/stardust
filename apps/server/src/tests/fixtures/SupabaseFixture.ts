import { execFileSync } from 'node:child_process'

import { ENV } from '@/constants'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
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

  clearInsigniasTables() {
    execFileSync('psql', [
      ENV.databaseUrl,
      '-c',
      'delete from public.users_acquired_insignias; delete from public.insignias;',
    ])
  }

  deleteInsigniaByRole(role: 'engineer' | 'god') {
    execFileSync('psql', [
      ENV.databaseUrl,
      '-c',
      `delete from public.users_acquired_insignias where insignia_id in (select id from public.insignias where role = '${role}'); delete from public.insignias where role = '${role}';`,
    ])
  }

  async clearDatabase() {
    await LocalSupabaseProxy.ensureRunning()

    this.clearInsigniasTables()

    await this.supabase.from('users_acquired_avatars').delete()
    await this.supabase.from('users_acquired_insignias').delete()
    await this.supabase.from('users_acquired_rockets').delete()
    await this.supabase.from('users').delete()
    await this.supabase.from('achievements').delete()
    await this.supabase.from('avatars').delete()
    await this.supabase.from('insignias').delete()
    await this.supabase.from('rockets').delete()
  }
}
