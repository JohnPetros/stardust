import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { ENV } from '@/constants'

export const SupabaseServerClient = () => {
  const cookieStore = cookies()

  return createServerClient(ENV.supabaseUrl, ENV.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  })
}
