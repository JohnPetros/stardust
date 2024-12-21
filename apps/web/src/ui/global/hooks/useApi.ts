import { useMemo } from 'react'

import { useSupabaseApi } from '../../../api/supabase'
import type { IApi } from '../../../api/interfaces'

export function useApi(): IApi {
  const supabaseApi = useSupabaseApi()

  return supabaseApi
}
