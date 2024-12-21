import type { AuthError } from '@supabase/supabase-js'

import { ApiResponse } from '@stardust/core/responses'

export const SupabaseAuthError = <Data>(authError: AuthError, errorMessage: string) => {
  console.error('Supabase auth error cause: ', authError.cause)
  console.error('Supabase auth error message: ', authError.message)

  return new ApiResponse<Data>({
    errorMessage,
    statusCode: Number(authError.code),
  })
}
