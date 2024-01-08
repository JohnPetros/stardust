'use client'

import { useMemo } from 'react'

import { AchievementService } from './achievementService'
import { AuthController } from './authController'
import { AvatarService } from './avatarService'
import { CategoryService } from './categoryService'
import { ChallengeService } from './challengeService'
import { CookiesController } from './cookiesControllers'
import { MdxController } from './mdxService'
import { PlanetService } from './planetService'
import { RankingService } from './rankingService'
import { RocketService } from './rocketService'
import { StarService } from './starService'
import { UserService } from './userService'

import { useSupabase } from '@/hooks/useSupabase'

export function useApi() {
  const { supabase } = useSupabase()

  const api = useMemo(() => {
    return {
      ...AuthController(supabase),
      ...UserService(supabase),
      ...AchievementService(supabase),
      ...StarService(supabase),
      ...PlanetService(supabase),
      ...AvatarService(supabase),
      ...RocketService(supabase),
      ...RankingService(supabase),
      ...CategoryService(supabase),
      ...ChallengeService(supabase),
      ...CookiesController(),
      ...MdxController(),
    }
  }, [supabase])

  return api
}
