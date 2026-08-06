import type { PostgrestError } from '@supabase/supabase-js'

import { AppError } from '@stardust/core/global/errors'

export class SupabasePostgreError extends AppError {
  constructor(_error: PostgrestError) {
    super('Ocorreu um erro ao acessar o banco de dados')
  }
}
