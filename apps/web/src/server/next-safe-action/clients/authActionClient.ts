import { SupabaseServerActionClient } from '@/api/supabase/clients/SupabaseServerActionClient'
import { actionClient } from './actionClient'
import { SupabaseAuthService, SupabaseProfileService } from '@/api/supabase/services'

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await SupabaseServerActionClient()
  const authService = SupabaseAuthService(supabase)
  const authResponse = await authService.fetchUserId()
  if (authResponse.isFailure) authResponse.throwError()

  const profileService = SupabaseProfileService(supabase)
  const profileResponse = await profileService.fetchUserById(authResponse.body)
  if (profileResponse.isFailure) profileResponse.throwError()

  return next({ ctx: { user: profileResponse.body } })
})
