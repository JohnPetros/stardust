'use server'

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

  const { user, newUnlockedAchievements } = await useCase.do({ achievementsDTO, userDTO })

  return {
    userDTO: user.dto,
    newUnlockedAchievementsDTO: newUnlockedAchievements.map(
      (achievement) => achievement.dto
    ),
  }
}
