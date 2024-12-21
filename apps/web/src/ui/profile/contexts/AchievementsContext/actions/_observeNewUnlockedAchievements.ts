'use server'

import type { AchievementDto, UserDto } from '#dtos'
import { ObserveNewUnlockedAchievementsUseCase } from '@/@core/use-cases/achievements'
import { SupabaseServerActionClient } from 'SupabaseServerClient/SupabaseServerActionClient'
import { SupabaseAchievementsService } from '@/api/supabase/services'

export async function _observeNewUnlockedAchievements(
  achievementsDto: AchievementDto[],
  userDto: UserDto,
) {
  const supabase = SupabaseServerActionClient()
  const achievementsService = SupabaseAchievementsService(supabase)

  const useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

  const { user, newUnlockedAchievements } = await useCase.do({ achievementsDto, userDto })

  return {
    userDto: user.dto,
    newUnlockedAchievementsDto: newUnlockedAchievements.map(
      (achievement) => achievement.dto,
    ),
  }
}
