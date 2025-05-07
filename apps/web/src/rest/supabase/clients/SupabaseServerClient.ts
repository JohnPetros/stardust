import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { CLIENT_ENV } from '@/constants'

export const SupabaseServerClient = () => {
  const cookieStore = cookies()

  return createServerClient(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  })
}
