'use client'

import { createClient } from '@/services/supabase-browser'
import { ReactNode, createContext, useState } from 'react'

import type { Database } from '@/types/supabase'

import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'

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
