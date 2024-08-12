import { useMemo } from 'react'

import { useSupabaseApi } from './supabase'
import type { IApi } from './types'

export function useApi(): IApi {
  const supabaseApi = useSupabaseApi()

  return supabaseApi
}
