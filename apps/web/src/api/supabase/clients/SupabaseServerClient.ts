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
      setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
      },
    },
  })
}
