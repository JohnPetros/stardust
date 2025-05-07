import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

import { CLIENT_ENV } from '@/constants'

export const SupabaseRouteHandlerClient = () => {
  const cookieStore = cookies()

  return createServerClient(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        )
      },
    },
  })
}
