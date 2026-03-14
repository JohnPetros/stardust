'use client'

import { useMemo } from 'react'

import { SupabaseClient } from '@/realtime/supabase/client'
import { SupabaseProfileChannel } from '@/realtime/supabase/channels'
import type { RealtimeContextValue } from './types'

const supabaseClient = SupabaseClient()

export function useRealtimeContextProvider(): RealtimeContextValue {
  return useMemo(
    () => ({
      profileChannel: SupabaseProfileChannel(supabaseClient),
    }),
    [],
  )
}
