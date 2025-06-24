import { useMemo } from 'react'

import { useSupabaseContext } from '@/ui/global/contexts/SupabaseContext/hooks'

import {
  SupabaseProfileService,
  SupabaseShopService,
  SupabaseLessonService,
  SupabaseRankingService,
  SupabaseChallengingService,
  SupabasePlaygroundService,
  SupabaseStorageService,
} from '@/rest/supabase/services'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseProfileService(supabase),
      ...SupabaseShopService(supabase),
      ...SupabaseLessonService(supabase),
      ...SupabaseRankingService(supabase),
      ...SupabaseChallengingService(supabase),
      ...SupabasePlaygroundService(supabase),
      ...SupabaseStorageService(),
    }
  }, [supabase])

  return supabaseApi
}
