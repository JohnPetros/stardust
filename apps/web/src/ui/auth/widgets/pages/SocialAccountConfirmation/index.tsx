'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { SocialAccountConfirmationPageView } from './SocialAccountConfirmationPageView'
import { useSocialAccountConfirmationPage } from './useSocialAccountConfirmationPage'
import { useRealtimeContext } from '@/ui/global/hooks/useRealtimeContext'

export const SocialAccountConfirmationPage = () => {
  const rocketAnimationRef = useRef<AnimationRef | null>(null)
  const { account, handleRetryUserCreation, handleSignUpWithSocialAccount } =
    useAuthContext()
  const { profileChannel } = useRealtimeContext()
  const {
    isNewAccount,
    isRocketVisible,
    isUserCreated,
    isRetryVisible,
    isRetryingUserCreation,
    handleLinkClick,
    handleRetryUserCreation: handleRetry,
  } = useSocialAccountConfirmationPage({
    rocketAnimationRef,
    account,
    profileChannel,
    onRetryUserCreation: handleRetryUserCreation,
    onSignUpWithSocialAccount: handleSignUpWithSocialAccount,
  })

  return (
    <SocialAccountConfirmationPageView
      isNewAccount={isNewAccount}
      isRocketVisible={isRocketVisible}
      rocketAnimationRef={rocketAnimationRef}
      isUserCreated={isUserCreated}
      isRetryVisible={isRetryVisible}
      isRetryingUserCreation={isRetryingUserCreation}
      onLinkClick={handleLinkClick}
      onRetryUserCreation={handleRetry}
    />
  )
}
