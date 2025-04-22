import type { AuthError } from '@supabase/supabase-js'

import { ApiResponse } from '@stardust/core/global/responses'

export const SupabaseAuthError = <Data>(authError: AuthError, errorMessage: string) => {
  console.error('Supabase auth error message: ', authError.message)

  return new ApiResponse<Data>({
    errorMessage,
    statusCode: authError.status,
  })
}
