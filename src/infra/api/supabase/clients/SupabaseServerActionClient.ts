import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

import { ENV } from '@/modules/global/constants'

export const SupabaseServerActionClient = () => {
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
