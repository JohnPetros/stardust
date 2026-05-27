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

  async clearDatabase() {
    await LocalSupabaseProxy.ensureRunning()
    await this.supabase.from('users').delete()
    await this.supabase.from('achievements').delete()
    await this.supabase.from('insignias').delete()
    await this.supabase.from('avatars').delete()
    await this.supabase.from('rockets').delete()
    await this.supabase.from('tiers').delete()
  }
}
