import type { SupabaseClient } from '@supabase/supabase-js'

export abstract class SupabaseRepository {
  constructor(protected readonly supabase: SupabaseClient) {}
}
