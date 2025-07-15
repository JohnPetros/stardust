import type { PostgrestError } from '@supabase/supabase-js'

import { AppError } from '@stardust/core/global/errors'

export class SupabasePostgreError extends AppError {
  constructor(error: PostgrestError) {
    super(error.message)
  }
}
