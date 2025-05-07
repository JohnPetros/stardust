import { useSupabaseApi } from './useSupabaseApi'

export function useApi() {
  const supabaseApi = useSupabaseApi()

  return supabaseApi
}
