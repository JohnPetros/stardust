'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { SocialAccountConfirmationPageView } from './SocialAccountConfirmationPageView'
import { useSocialAccountConfirmationPage } from './useSocialAccountConfirmationPage'
import { useProfileSocket } from '@/ui/global/hooks/useProfileSocket'

export const SocialAccountConfirmationPage = () => {
  const rocketAnimationRef = useRef<AnimationRef | null>(null)
  const { account, handleSignUpWithSocialAccount } = useAuthContext()
  const {
    isNewAccount,
    isRocketVisible,
    isUserCreated,
    handleLinkClick,
    handleUserCreated,
  } = useSocialAccountConfirmationPage({
    rocketAnimationRef,
    account,
    handleSignUpWithSocialAccount,
  })
  useProfileSocket(handleUserCreated)

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
