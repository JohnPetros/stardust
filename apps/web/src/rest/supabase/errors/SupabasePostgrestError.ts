import type { PostgrestError } from '@supabase/supabase-js'

import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

export const SupabasePostgrestError = <Data>(
  postgrestError: PostgrestError,
  errorMessage: string,
  statusCode: number = HTTP_STATUS_CODE.serverError,
) => {
  console.error('Supabase postgrest error message:', postgrestError.message)
  console.error('Supabase postgrest error status:', statusCode)

  return new RestResponse<Data>({
    errorMessage,
    statusCode: HTTP_STATUS_CODE.serverError,
  })
}
