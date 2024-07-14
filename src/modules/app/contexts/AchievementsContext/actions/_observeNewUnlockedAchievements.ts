import type { AchievementDTO, UserDTO } from '@/@core/dtos'
import { ObserveNewUnlockedAchievementsUseCase } from '@/@core/use-cases/achievements'
import { SupabaseServerActionClient } from '@/infra/api/supabase/clients/SupabaseServerActionClient'
import { SupabaseAchievementsService } from '@/infra/api/supabase/services'

export async function _observeNewUnlockedAchievements(
  achievementsDTO: AchievementDTO[],
  userDTO: UserDTO
) {
  const supabase = SupabaseServerActionClient()
  const achievementsService = SupabaseAchievementsService(supabase)

  const useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

  return await useCase.do({ achievementsDTO, userDTO })
}
