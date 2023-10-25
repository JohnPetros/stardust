'use client'

import { createContext, ReactNode, useState } from 'react'
import {
  createClientComponentClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/@types/supabase'

type SupabaseContextValue = {
  supabase: SupabaseClient<Database>
}

interface SupabaseProviderProps {
  children: ReactNode
}

export const SupabaseContext = createContext({} as SupabaseContextValue)

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState(() => createClientComponentClient())

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}
