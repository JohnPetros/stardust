'use client'

import { AchievementService } from './achievementService'
import { AuthService } from './authService'
import { AvatarService } from './avatarService'
import { CategoryService } from './categoryService'
import { ChallengeService } from './challengeService'
import { MdxService } from './mdxService'
import { PlanetService } from './planetService'
import { RankingService } from './rankingService'
import { RocketService } from './rocketService'
import { StarService } from './starService'
import { UserService } from './userService'

import { useSupabase } from '@/hooks/useSupabase'

export function useApi() {
  const { supabase } = useSupabase()

  return {
    ...AuthService(supabase),
    ...UserService(supabase),
    ...AchievementService(supabase),
    ...StarService(supabase),
    ...PlanetService(supabase),
    ...AvatarService(supabase),
    ...RocketService(supabase),
    ...RankingService(supabase),
    ...CategoryService(supabase),
    ...ChallengeService(supabase),
    ...MdxService(),
  }
}
