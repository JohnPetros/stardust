'use client'

import { useMemo } from 'react'

import { IApi } from './interfaces/IApi'
import { useServerApi } from './server'
import { useSupabaseApi } from './supabase'

export function useApi(): IApi {
  const supabaseApi = useSupabaseApi()
  const serverApi = useServerApi()

  const api = useMemo(() => {
    return {
      ...supabaseApi,
      ...serverApi,
    }
  }, [supabaseApi, serverApi])

  return api
}
