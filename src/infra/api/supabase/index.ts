'use client'

import { useMemo } from 'react'

import { useSupabaseContext } from '@/ui/global/contexts/SupabaseContext/hooks'

import {
  SupabaseAvatarsService,
  SupabaseAchievementsService,
  SupabaseUsersService,
  SupabaseAuthService,
  SupabaseRocketsService,
  SupabaseSpaceService,
  SupabaseLessonService,
  SupabaseRankingsService,
  SupabaseChallengesService,
  SupabaseStorageService,
  SupabaseDocsService,
} from './services'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseAchievementsService(supabase),
      ...SupabaseAuthService(supabase),
      ...SupabaseUsersService(supabase),
      ...SupabaseAvatarsService(supabase),
      ...SupabaseRocketsService(supabase),
      ...SupabaseSpaceService(supabase),
      ...SupabaseLessonService(supabase),
      ...SupabaseRankingsService(supabase),
      ...SupabaseChallengesService(supabase),
      ...SupabaseDocsService(supabase),
      ...SupabaseStorageService(),
    }
  }, [supabase])

  return supabaseApi
}
