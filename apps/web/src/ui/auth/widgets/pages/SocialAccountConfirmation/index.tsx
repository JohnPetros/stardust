'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { SocialAccountConfirmationPageView } from './SocialAccountConfirmationPageView'
import { useSocialAccountConfirmationPage } from './useSocialAccountConfirmationPage'
import { useRealtimeContext } from '@/ui/global/hooks/useRealtimeContext'

export const SocialAccountConfirmationPage = () => {
  const rocketAnimationRef = useRef<AnimationRef | null>(null)
  const { account, handleSignUpWithSocialAccount } = useAuthContext()
  const { profileChannel } = useRealtimeContext()
  const { isNewAccount, isRocketVisible, isUserCreated, handleLinkClick } =
    useSocialAccountConfirmationPage({
      rocketAnimationRef,
      account,
      profileChannel,
      onSignUpWithSocialAccount: handleSignUpWithSocialAccount,
    })

  return (
    <SocialAccountConfirmationPageView
      isNewAccount={isNewAccount}
      isRocketVisible={isRocketVisible}
      rocketAnimationRef={rocketAnimationRef}
      isUserCreated={isUserCreated}
      onLinkClick={handleLinkClick}
    />
  )
}
