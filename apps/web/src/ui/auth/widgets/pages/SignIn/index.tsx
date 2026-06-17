'use client'

import { useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useSignInPage } from './useSignInPage'
import { SignInPageView } from './SignInPageView'

export const SignInPage = () => {
  const rocketAnimationRef = useRef<AnimationRef>(null)
  const searchParams = useSearchParams()
  const nextRoute = searchParams.get('nextRoute') ?? ''
  const error = searchParams.get('error') ?? ''
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
