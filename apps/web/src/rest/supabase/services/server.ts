import {
  SupabaseLessonService,
  SupabaseRankingService,
  SupabaseStorageService,
} from '@/rest/supabase/services'
import { SupabaseServerClient } from '../clients'

const supabase = SupabaseServerClient()

export const lessonService = SupabaseLessonService(supabase)
export const rankingService = SupabaseRankingService(supabase)
export const storageService = SupabaseStorageService()
