'use server'

import { NextRequest, NextResponse } from 'next/server'

import { SupabaseMiddlewareClient } from '@/infra/api/supabase/clients'
import { SupabaseAuthService } from '@/infra/api/supabase/services'
import { checkPublicRoute } from '@/modules/global/utils'
import { ROUTES } from '@/modules/global/constants'

export async function _handleAuthRoutes(
  req: NextRequest,
  res: NextResponse,
  currentRoute: string
) {
  const supabase = SupabaseMiddlewareClient({ req, res })
  const isPublicRoute = checkPublicRoute(currentRoute)
  const authController = SupabaseAuthService(supabase)
  const hasSession = Boolean(await authController.getUserId())

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.public.signIn, req.url))
  }
}
