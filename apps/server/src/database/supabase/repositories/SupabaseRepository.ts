import type { SupabaseClient } from '@supabase/supabase-js'

export abstract class SupabaseRepository {
  constructor(protected readonly supabase: SupabaseClient) {}

  protected calculateQueryRange(page: number, itemsPerPage: number) {
    const offset = (page - 1) * itemsPerPage

    return {
      from: offset,
      to: offset + itemsPerPage - 1,
    }
  }
}
