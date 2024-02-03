'use client'

import { useMemo } from 'react'

import { AchievementsController } from './controllers/achievementsController'
import { AuthController } from './controllers/authController'
import { AvatarsController } from './controllers/avatarsController'
import { CategoriesController } from './controllers/categoriesController'
import { CdnController } from './controllers/cdnController'
import { ChallengesController } from './controllers/challengesController'
import { CommentsController } from './controllers/commentsController'
import { DocsController } from './controllers/docsController'
import { PlanetsController } from './controllers/planetsController'
import { RankingsController } from './controllers/rankingController'
import { RocketsController } from './controllers/rocketController'
import { StarsController } from './controllers/starsController'
import { UsersController } from './controllers/usersController'

import { useSupabaseContext } from '@/contexts/SupabaseContext/hooks/useSupabaseContext'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...AchievementsController(supabase),
      ...RocketsController(supabase),
      ...AuthController(supabase),
      ...AvatarsController(supabase),
      ...CategoriesController(supabase),
      ...CdnController(supabase),
      ...ChallengesController(supabase),
      ...PlanetsController(supabase),
      ...RankingsController(supabase),
      ...StarsController(supabase),
      ...UsersController(supabase),
      ...CommentsController(supabase),
      ...DocsController(supabase),
    }
  }, [supabase])

  return supabaseApi
}
