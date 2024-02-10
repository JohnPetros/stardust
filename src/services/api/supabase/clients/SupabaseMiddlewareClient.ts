import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

import type { Database } from '../types/Database'

type Context = {
  req: NextRequest
  res: NextResponse<unknown>
}

const SupabaseMiddlewareClient = (context: Context) => {
  return createMiddlewareClient<Database>(context)
}

export { SupabaseMiddlewareClient }
