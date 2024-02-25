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
import { SupabaseRankingsController } from './controllers/SupabaseRankingsController'
import { SupabaseRocketsController } from './controllers/SupabaseRocketsController'
import { SupabaseSolutionsController } from './controllers/SupabaseSolutionsController'
import { SupabaseStarsController } from './controllers/SupabaseStarsController'
import { SupabaseStorageController } from './controllers/SupabaseStorageController'
import { SupabaseUsersController } from './controllers/SupabaseUsersController'
import { SupabaseWinnersController } from './controllers/SupabaseWinnersController'

import { useSupabaseContext } from '@/contexts/SupabaseContext/hooks/useSupabaseContext'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseAchievementsController(supabase),
      ...SupabaseAuthController(supabase),
      ...SupabaseDocsController(supabase),
      ...SupabaseStarsController(supabase),
      ...SupabaseRocketsController(supabase),
      ...SupabaseAvatarsController(supabase),
      ...SupabasePlanetsController(supabase),
      ...SupabaseStorageController(supabase),
      ...SupabaseRankingsController(supabase),
      ...SupabaseCommentsController(supabase),
      ...SupabaseCategoriesController(supabase),
      ...SupabaseChallengesController(supabase),
      ...SupabasePlaygroundsController(supabase),
      ...SupabaseSolutionsController(supabase),
      ...SupabaseUsersController(supabase),
      ...SupabaseWinnersController(supabase),
    }
  }, [supabase])

  return supabaseApi
}
