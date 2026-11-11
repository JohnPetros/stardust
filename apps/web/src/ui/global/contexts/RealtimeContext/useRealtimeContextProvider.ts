'use client'

import { useMemo } from 'react'
import type { Account } from '@stardust/core/auth/entities'
import type { ProfileChannel, ProfileService } from '@stardust/core/profile/interfaces'

import type { RealtimeContextValue } from './types'
import { useProfileCreationPolling } from './useProfileCreationPolling'

type Params = {
  profileChannel?: ProfileChannel
  profileService: ProfileService
  account: Account | null
  accessToken: string | null
}

export function useRealtimeContextProvider(params: Params): RealtimeContextValue {
  const { profileChannel, ...session } = params
  const pollingChannel = useProfileCreationPolling(session)

  return useMemo(
    () => ({ profileChannel: profileChannel ?? pollingChannel }),
    [profileChannel, pollingChannel],
  )
}
