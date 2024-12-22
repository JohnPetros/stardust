'use server'

import type { ChallengeCompletionStatus } from '@/@core/domain/types'
import type { UserDTO } from '@/@core/dtos'
import type { ChallengesListParams } from '@/@core/types'
import { ListChallengesUseCase } from '@/@core/use-cases/challenges'
import { SupabaseServerClient } from 'SupabaseServerClient'
import { SupabaseChallengingService } from '@/api/supabase/services'

export async function _listChallenges(
  userDTO: UserDTO,
  completionStatus: ChallengeCompletionStatus,
  listParams: ChallengesListParams,
) {
  const supabase = SupabaseServerClient()
  const challengesService = SupabaseChallengingService(supabase)

  const useCase = new ListChallengesUseCase(challengesService)
  return await useCase.do({ userDTO, completionStatus, listParams })
}
