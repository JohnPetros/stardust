import type { IApi } from '@stardust/core/interfaces'
import { useSupabaseApi } from './use-supabase-api'

export function useApi(): IApi {
  const supabaseApi = useSupabaseApi()

  return supabaseApi
}
