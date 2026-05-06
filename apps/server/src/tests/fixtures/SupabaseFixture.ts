import { ENV } from '@/constants'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

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
    await this.supabase.from('users').delete()
    await this.supabase.from('achievements').delete()
  }
}
