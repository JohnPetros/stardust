'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useSignInPage } from './useSignInPage'
import { SignInPageView } from './SignInPageView'

export const SignInPage = () => {
  const rocketAnimationRef = useRef<AnimationRef>(null)
  const [nextRoute] = useQueryStringParam('nextRoute')
  const [error] = useQueryStringParam('error')
  const { handleSignIn } = useAuthContext()
  const { isRocketVisible, handleFormSubmit } = useSignInPage({
    rocketAnimationRef,
    error,
    nextRoute,
    handleSignIn,
  })

  return (
    <SignInPageView
      rocketAnimationRef={rocketAnimationRef}
      isRocketVisible={isRocketVisible}
      handleFormSubmit={handleFormSubmit}
    />
  )
}
