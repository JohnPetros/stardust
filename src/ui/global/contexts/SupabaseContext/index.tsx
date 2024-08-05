'use client'

import { createContext, ReactNode, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '@/infra/api/supabase/types/Database'
import { SupabaseBrowserClient } from '@/infra/api/supabase/clients/SupabaseBrowserClient'

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
