import type { AuthError } from '@supabase/supabase-js'

import { BaseError } from '@/@core/errors/global/BaseError'
import { ServiceResponse } from '@/@core/responses'

export const SupabaseAuthError = <Data>(
  authError: AuthError,
  error: typeof BaseError
) => {
  // console.error('Supabase auth error cause: ', authError.cause)
  // console.error('Supabase auth error message: ', authError.message)

  return new ServiceResponse<Data>(null, error)
}
