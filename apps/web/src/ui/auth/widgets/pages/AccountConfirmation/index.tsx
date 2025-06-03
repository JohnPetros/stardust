'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

import { useAccountConfirmationPage } from './useAccountConfirmationPage'
import { AccountConfirmationPageView } from './AccountConfirmationPageView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function AccountConfirmationPage() {
  const rocketAnimationRef = useRef<AnimationRef>(null)
  const { isRocketVisible, handleLinkClick } =
    useAccountConfirmationPage(rocketAnimationRef)
  const { user } = useAuthContext()

  return (
    <AccountConfirmationPageView
      rocketAnimationRef={rocketAnimationRef}
      isRocketVisible={isRocketVisible}
      user={user ? user.dto : null}
      onLinkClick={handleLinkClick}
    />
  )
}
