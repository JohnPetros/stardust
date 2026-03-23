'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

import { useAccountConfirmationPage } from './useAccountConfirmationPage'
import { AccountConfirmationPageView } from './AccountConfirmationPageView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRealtimeContext } from '@/ui/global/hooks/useRealtimeContext'

export function AccountConfirmationPage() {
  const rocketAnimationRef = useRef<AnimationRef>(null)
  const { account, user, refetchUser, handleRetryUserCreation } = useAuthContext()
  const { profileChannel } = useRealtimeContext()
  const {
    isRocketVisible,
    isRetryVisible,
    isRetryingUserCreation,
    handleLinkClick,
    handleRetryUserCreation: handleRetry,
  } = useAccountConfirmationPage({
    rocketAnimationRef,
    account,
    user,
    profileChannel,
    onRefetchUser: refetchUser,
    onRetryUserCreation: handleRetryUserCreation,
  })

  return (
    <AccountConfirmationPageView
      rocketAnimationRef={rocketAnimationRef}
      isRocketVisible={isRocketVisible}
      isRetryVisible={isRetryVisible}
      isRetryingUserCreation={isRetryingUserCreation}
      user={user ? user.dto : null}
      onLinkClick={handleLinkClick}
      onRetryUserCreation={handleRetry}
    />
  )
}
