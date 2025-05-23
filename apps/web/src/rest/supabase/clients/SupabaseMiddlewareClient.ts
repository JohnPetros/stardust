import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import type { Database } from '../types/Database'

import { CLIENT_ENV } from '@/constants'

const SupabaseMiddlewareClient = (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  })

  return createServerClient<Database>(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })
}

export { SupabaseMiddlewareClient }
