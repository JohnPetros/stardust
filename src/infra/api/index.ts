import { useMemo } from 'react'

import { useSupabaseApi } from './supabase'

export function useApi() {
  const supabaseApi = useSupabaseApi()

  const api = useMemo(() => {
    return {
      ...supabaseApi,
    }
  }, [supabaseApi])

  return api
}
