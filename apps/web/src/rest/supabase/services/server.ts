import {
  SupabaseProfileService,
  SupabaseShopService,
  SupabaseLessonService,
  SupabaseRankingService,
  SupabaseChallengingService,
  SupabasePlaygroundService,
  SupabaseStorageService,
} from '@/rest/supabase/services'
import { SupabaseServerClient } from '../clients'

const supabase = SupabaseServerClient()

export const profileService = SupabaseProfileService(supabase)
export const shopService = SupabaseShopService(supabase)
export const lessonService = SupabaseLessonService(supabase)
export const rankingService = SupabaseRankingService(supabase)
export const challengingService = SupabaseChallengingService(supabase)
export const playgroundService = SupabasePlaygroundService(supabase)
export const storageService = SupabaseStorageService()
