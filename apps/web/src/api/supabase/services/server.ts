import {
  SupabaseProfileService,
  SupabaseAuthService,
  SupabaseShopService,
  SupabaseSpaceService,
  SupabaseLessonService,
  SupabaseRankingService,
  SupabaseChallengingService,
  SupabasePlaygroundService,
  SupabaseForumService,
  SupabaseStorageService,
} from '@/api/supabase/services'
import { SupabaseServerClient } from '../clients'

const supabase = SupabaseServerClient()

export const profileService = SupabaseProfileService(supabase)
export const authService = SupabaseAuthService(supabase)
export const spaceService = SupabaseSpaceService(supabase)
export const shopService = SupabaseShopService(supabase)
export const lessonService = SupabaseLessonService(supabase)
export const rankingService = SupabaseRankingService(supabase)
export const challengingService = SupabaseChallengingService(supabase)
export const forumService = SupabaseForumService(supabase)
export const playgroundService = SupabasePlaygroundService(supabase)
export const storageService = SupabaseStorageService()
