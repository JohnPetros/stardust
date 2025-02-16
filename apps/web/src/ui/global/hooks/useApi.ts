import type { IApi } from '@stardust/core/interfaces'
import { useSupabaseApi } from './useSupabaseApi'

export function useApi(): IApi {
  const supabaseApi = useSupabaseApi()

  return supabaseApi
}
