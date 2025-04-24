import { notFound } from 'next/navigation'

import { SupabaseAuthService, SupabaseProfileService } from '@/rest/supabase/services'
import { SupabaseServerActionClient } from '@/rest/supabase/clients'
import { actionClient } from './actionClient'

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = SupabaseServerActionClient()
  const authService = SupabaseAuthService(supabase)
  const authResponse = await authService.fetchUserId()
  if (authResponse.isFailure) notFound()

  const profileService = SupabaseProfileService(supabase)
  const profileResponse = await profileService.fetchUserById(authResponse.body)
  if (profileResponse.isFailure) profileResponse.throwError()

  return next({ ctx: { user: profileResponse.body } })
})
