'use client'

import { type RefObject, useEffect, useState } from 'react'

import { Slug } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { SignInFormFields } from './SignInForm/types'

const ROCKET_ANIMATION_SESSION_KEY = 'stardust:sign-in-rocket-animation'
const ROCKET_ANIMATION_SESSION_TTL = 10_000

type Params = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  error: string
  nextRoute: string
  handleSignIn: (email: string, password: string) => Promise<boolean>
}

export function useSignInPage({
  rocketAnimationRef,
  error,
  nextRoute,
  handleSignIn,
}: Params) {
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const { sleep } = useSleep()
  const toast = useToastContext()
  const router = useNavigationProvider()

  useEffect(() => {
    const startedAt = Number(sessionStorage.getItem(ROCKET_ANIMATION_SESSION_KEY))
    const isRecentTransition =
      Number.isFinite(startedAt) && Date.now() - startedAt < ROCKET_ANIMATION_SESSION_TTL

    if (isRecentTransition) {
      setIsRocketVisible(true)
      return
    }

    sessionStorage.removeItem(ROCKET_ANIMATION_SESSION_KEY)
  }, [])

  async function handleFormSubmit({ email, password }: SignInFormFields) {
    const isSuccessful = await handleSignIn(email, password)
    if (!isSuccessful) return

    sessionStorage.setItem(ROCKET_ANIMATION_SESSION_KEY, String(Date.now()))
    setIsRocketVisible(true)

    await sleep(ROCKET_ANIMATION_DELAY)

    rocketAnimationRef.current?.restart()

    await sleep(3000) // 3 seconds

    if (nextRoute) {
      sessionStorage.removeItem(ROCKET_ANIMATION_SESSION_KEY)
      router.goTo(nextRoute)
      return
    }

    sessionStorage.removeItem(ROCKET_ANIMATION_SESSION_KEY)
    router.goTo(ROUTES.space)
  }

  useEffect(() => {
    if (error) {
      const errorMessage = error.split('error=').at(-1)
      if (!errorMessage) return

      toast.showError(Slug.deslugify(errorMessage), 3.5)
    }
  }, [error, toast])

  return {
    rocketAnimationRef,
    isRocketVisible,
    handleFormSubmit,
  }
}
