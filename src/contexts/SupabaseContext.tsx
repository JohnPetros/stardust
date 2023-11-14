'use client'

import { createContext, ReactNode, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from 'supabase/supabase-browser'

import type { Database } from '@/@types/database'

type SupabaseContextValue = {
  supabase: SupabaseClient<Database>
}

interface SupabaseProviderProps {
  children: ReactNode
}

export const SupabaseContext = createContext({} as SupabaseContextValue)

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState(() => createClient())

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}
