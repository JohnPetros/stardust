'use client'

import { useMemo } from 'react'

import { SupabaseAchievementsController } from './controllers/SupabaseAchievementsController'
import { SupabaseAuthController } from './controllers/SupabaseAuthController'
import { SupabaseAvatarsController } from './controllers/SupabaseAvatarsController'
import { SupabaseCategoriesController } from './controllers/SupabaseCategoriesController'
import { SupabaseChallengesController } from './controllers/SupabaseChallengesController'
import { SupabaseCommentsController } from './controllers/SupabaseCommentsController'
import { SupabaseDocsController } from './controllers/SupabaseDocsController'
import { SupabasePlanetsController } from './controllers/SupabasePlanetsController'
import { SupabasePlaygroundsController } from './controllers/SupabasePlaygroundsController'
import { SupabaseRankingsController } from './controllers/SupabaseRankingController'
import { SupabaseRocketsController } from './controllers/SupabaseRocketController'
import { SupabaseStarsController } from './controllers/SupabaseStarsController'
import { SupabaseStorageController } from './controllers/SupabaseStorageController'
import { SupabaseUsersController } from './controllers/SupabaseUsersController'
import { SupabaseWinnersController } from './controllers/SupabaseWinnersController'

import { useSupabaseContext } from '@/contexts/SupabaseContext/hooks/useSupabaseContext'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseAuthController(supabase),
      ...SupabaseUsersController(supabase),
      ...SupabaseDocsController(supabase),
      ...SupabaseStarsController(supabase),
      ...SupabaseRocketsController(supabase),
      ...SupabaseAvatarsController(supabase),
      ...SupabasePlanetsController(supabase),
      ...SupabaseStorageController(supabase),
      ...SupabaseWinnersController(supabase),
      ...SupabaseRankingsController(supabase),
      ...SupabaseCommentsController(supabase),
      ...SupabaseCategoriesController(supabase),
      ...SupabaseChallengesController(supabase),
      ...SupabasePlaygroundsController(supabase),
      ...SupabaseAchievementsController(supabase),
    }
  }, [supabase])

  return supabaseApi
}
