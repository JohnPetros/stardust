'use server'

import type { ChallengeDTO } from '@/@core/dtos'
import { UnlockDocUseCase } from '@/@core/use-cases/docs'
import { SupabaseServerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabaseDocsService,
  SupabaseUsersService,
} from '@/infra/api/supabase/services'

export async function _unlockDoc(challengeDTO: ChallengeDTO) {
  const supabase = SupabaseServerClient()
  const authService = SupabaseAuthService(supabase)
  const usersService = SupabaseUsersService(supabase)
  const docsService = SupabaseDocsService(supabase)

  const userIdResponse = await authService.fetchUserId()
  if (userIdResponse.isFailure) return userIdResponse.throwError()

  const userResponse = await usersService.fetchUserById(userIdResponse.data)
  if (userResponse.isFailure) return userResponse.throwError()

  const useCase = new UnlockDocUseCase(docsService)

  await useCase.do({ userDTO: userResponse.data, challengeDTO })
}
