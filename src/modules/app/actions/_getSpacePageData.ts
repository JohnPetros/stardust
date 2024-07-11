'use server'

import { SupabaseServerActionClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabasePlanetsService,
  SupabaseUsersService,
} from '@/infra/api/supabase/services'

export async function _getSpacePageData() {
  const supabase = SupabaseServerActionClient()
  const authService = SupabaseAuthService(supabase)
  const usersService = SupabaseUsersService(supabase)
  const planetsService = SupabasePlanetsService(supabase)

  const planetsResponse = await planetsService.fetchPlanets()
  if (planetsResponse.isFailure) planetsResponse.throwError()

  const planetsDTO = planetsResponse.data

  const userIdresponse = await authService.fetchUserId()
  if (userIdresponse.isFailure) userIdresponse.throwError()

  const userId = userIdresponse.data
  const userUnlockedStarsIdsRespose = await usersService.fetchUserUnlockedStarsIds(userId)
  if (userUnlockedStarsIdsRespose.isFailure) userUnlockedStarsIdsRespose.throwError()

  const userUnlockedStarsIds = userUnlockedStarsIdsRespose.data

  return {
    planetsDTO,
    userUnlockedStarsIds,
  }
}
