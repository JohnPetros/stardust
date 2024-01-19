'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

import { createBrowserClient } from '@/services/api/supabase/clients/browserClient'
import { Database } from '@/services/api/supabase/types/database'

type SupabaseContextValue = {
  supabase: SupabaseClient<Database>
}

interface SupabaseProviderProps {
  children: ReactNode
}

export const SupabaseContext = createContext({} as SupabaseContextValue)

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState(() => createBrowserClient())

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error(
      'useSupabaseContext hook must be used inside SupabaseProvider'
    )
  } else {
    return context
  }
}
