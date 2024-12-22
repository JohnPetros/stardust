'use server'

import type { UserDto } from '@stardust/core/global/dtos'
import type { AchievementDto } from '@stardust/core/profile/dtos'
import { ObserveNewUnlockedAchievementsUseCase } from '@stardust/core/profile/use-cases'

import { SupabaseServerActionClient } from '@/api/supabase/clients'
import { SupabaseProfileService } from '@/api/supabase/services'

export async function _observeNewUnlockedAchievements(
  achievementsDto: AchievementDto[],
  userDto: UserDto,
) {
  const supabase = SupabaseServerActionClient()
  const achievementsService = SupabaseProfileService(supabase)

  const useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

  const { user, newUnlockedAchievements } = await useCase.do({ achievementsDto, userDto })

  return {
    userDto: user.dto,
    newUnlockedAchievementsDto: newUnlockedAchievements.map(
      (achievement) => achievement.dto,
    ),
  }
}
