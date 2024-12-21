import type { PostgrestError } from '@supabase/supabase-js'

import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

export const SupabasePostgrestError = <Data>(
  postgrestError: PostgrestError,
  errorMessage: string,
  statusCode = HTTP_STATUS_CODE.serverError,
) => {
  console.error('Supabase postgrest error message: ', postgrestError.message)
  console.error('Supabase postgrest error details: ', postgrestError.details)

  return new ApiResponse<Data>({
    errorMessage,
    statusCode,
  })
}
