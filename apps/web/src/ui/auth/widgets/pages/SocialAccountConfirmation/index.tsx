'use client'

import { useRef } from 'react'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { SocialAccountConfirmationPageView } from './SocialAccountConfirmationPageView'
import { useSignUpWithSocialAccountPage } from './useSignUpWithSocialAccountPage'
import { useSignUpWithSocialAccountAction } from './useSignUpWithSocialAccountAction'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export const SocialAccountConfirmationPage = () => {
  const rocketAnimationRef = useRef<AnimationRef | null>(null)
  const { user, refetchUser } = useAuthContext()
  const { signUpWithSocialAccount } = useSignUpWithSocialAccountAction()
  const { isNewAccount, isRocketVisible, handleLinkClick } =
    useSignUpWithSocialAccountPage({
      rocketAnimationRef,
      signUpWithSocialAccount,
      refetchUser,
    })

  return (
    <SocialAccountConfirmationPageView
      isNewAccount={isNewAccount}
      isRocketVisible={isRocketVisible}
      rocketAnimationRef={rocketAnimationRef}
      user={user?.dto ?? null}
      onLinkClick={handleLinkClick}
    />
  )
}
