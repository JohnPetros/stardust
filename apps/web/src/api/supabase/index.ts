'use client'

import { useMemo } from 'react'

import { useSupabaseContext } from '@/ui/global/contexts/SupabaseContext/hooks'

import {
  SupabaseAvatarsService,
  SupabaseProfileService,
  SupabaseUsersService,
  SupabaseAuthService,
  SupabaseRocketsService,
  SupabaseSpaceService,
  SupabaseLessonService,
  SupabaseRankingsService,
  SupabaseChallengingService,
  SupabaseStorageService,
  SupabaseDocsService,
} from './services'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseProfileService(supabase),
      ...SupabaseAuthService(supabase),
      ...SupabaseUsersService(supabase),
      ...SupabaseAvatarsService(supabase),
      ...SupabaseRocketsService(supabase),
      ...SupabaseSpaceService(supabase),
      ...SupabaseLessonService(supabase),
      ...SupabaseRankingsService(supabase),
      ...SupabaseChallengingService(supabase),
      ...SupabaseDocsService(supabase),
      ...SupabaseStorageService(),
    }
  }, [supabase])

  return supabaseApi
}
