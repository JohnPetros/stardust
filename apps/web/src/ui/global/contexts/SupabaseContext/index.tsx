'use client'

import { createContext, type ReactNode, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

import { SupabaseBrowserClient } from '@/api/supabase/clients/SupabaseBrowserClient'
import type { Database } from '@/api/supabase/types'

type SupabaseContextValue = {
  supabase: SupabaseClient<Database>
}

type SupabaseProviderProps = {
  children: ReactNode
}

export const SupabaseContext = createContext({} as SupabaseContextValue)

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState(() => SupabaseBrowserClient())

  return (
    <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
  )
}
