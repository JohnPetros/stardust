import { useMemo } from 'react'

import { useSupabaseContext } from '@/ui/global/contexts/SupabaseContext/hooks'

import {
  SupabaseLessonService,
  SupabaseRankingService,
  SupabaseStorageService,
} from '@/rest/supabase/services'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseLessonService(supabase),
      ...SupabaseRankingService(supabase),
      ...SupabaseStorageService(),
    }
  }, [supabase])

  return supabaseApi
}
