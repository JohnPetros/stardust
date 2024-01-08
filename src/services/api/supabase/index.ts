'use client'

import { useMemo } from 'react'

import { AchievementsController } from './controllers/achievementsController'
import { AuthController } from './controllers/authController'
import { AvatarsController } from './controllers/avatarsController'
import { CategoriesController } from './controllers/categoriesController'
import { ChallengesController } from './controllers/challengesController'
import { PlanetsController } from './controllers/planetsController'
import { RankingsController } from './controllers/rankingController'
import { RocketsController } from './controllers/rocketController'
import { StarsController } from './controllers/starsController'
import { UsersController } from './controllers/usersController'

import { useSupabase } from '@/hooks/useSupabase'

export function useSupabaseApi() {
  const { supabase } = useSupabase()

  const supabaseApi = useMemo(() => {
    return {
      ...AuthController(supabase),
      ...UsersController(supabase),
      ...AchievementsController(supabase),
      ...StarsController(supabase),
      ...PlanetsController(supabase),
      ...AvatarsController(supabase),
      ...RocketsController(supabase),
      ...RankingsController(supabase),
      ...CategoriesController(supabase),
      ...ChallengesController(supabase),
    }
  }, [supabase])

  return supabaseApi
}
