import type { PostgrestError } from '@supabase/supabase-js'

import { BaseError } from '@/@core/errors/global/BaseError'
import { ServiceResponse } from '@/@core/responses'

export const SupabasePostgrestError = <Data>(
  postgrestError: PostgrestError,
  error: typeof BaseError
) => {
  console.error('Supabase postgrest error message: ', postgrestError.message)
  console.error('Supabase postgrest error details: ', postgrestError.details)

  return new ServiceResponse<Data>(null, error)
}
