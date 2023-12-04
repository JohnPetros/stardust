import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { ROUTES } from '@/utils/constants'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log({ code })

  try {
    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      const response = await supabase.auth.exchangeCodeForSession(code)
      console.log({ response })
    }
  } catch (error) {
    console.error(error)
  }

  return NextResponse.redirect(ROUTES.public.signUp)
}
