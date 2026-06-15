'use client'

import { useMemo } from 'react'
import type { ProfileChannel } from '@stardust/core/profile/interfaces'

import { SupabaseClient } from '@/realtime/supabase/client'
import { SupabaseProfileChannel } from '@/realtime/supabase/channels'
import type { RealtimeContextValue } from './types'

const supabaseClient = SupabaseClient()

export function useRealtimeContextProvider(
  profileChannel?: ProfileChannel,
): RealtimeContextValue {
  return useMemo(
    () => ({
      profileChannel: profileChannel ?? SupabaseProfileChannel(supabaseClient),
    }),
    [profileChannel],
  )
}
