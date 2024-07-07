'use client'

import { useMemo } from 'react'

import { useSupabaseContext } from '@/modules/global/contexts/SupabaseContext/hooks'

import { SupabaseAuthService } from './services/SupabaseAuthService'
import { SupabaseUsersService } from './services/SupabaseUsersService'

export function useSupabaseApi() {
  const { supabase } = useSupabaseContext()

  const supabaseApi = useMemo(() => {
    return {
      ...SupabaseAuthService(supabase),
      ...SupabaseUsersService(supabase),
    }
  }, [supabase])

  return supabaseApi
}
