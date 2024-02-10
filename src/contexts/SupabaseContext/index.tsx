'use client'

import { createContext, ReactNode, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

import { SupabaseBrowserClient } from '@/services/api/supabase/clients/SupabaseBrowserClient'
import { Database } from '@/services/api/supabase/types/Database'

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
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}
