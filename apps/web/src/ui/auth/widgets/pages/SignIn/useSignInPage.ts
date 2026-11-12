'use client'

import { type RefObject, useEffect, useState } from 'react'

import type { AuthService } from '@stardust/core/auth/interfaces'
import { Email, Slug } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import type { SignInResult } from '@/ui/auth/contexts/AuthContext/types'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { SignInFormFields } from './SignInForm/types'

type Params = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  error: string
  nextRoute: string
  handleSignIn: (email: string, password: string) => Promise<SignInResult>
  authService: AuthService
}

export function useSignInPage({
  rocketAnimationRef,
  error,
  nextRoute,
  handleSignIn,
  authService,
}: Params) {
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const { sleep } = useSleep()
  const toast = useToastContext()
  const router = useNavigationProvider()

  async function handleFormSubmit({ email, password }: SignInFormFields) {
    setUnconfirmedEmail(null)

    const result = await handleSignIn(email, password)

    if (result === 'email-not-confirmed') {
      setUnconfirmedEmail(email)
      return
    }

    if (result !== 'signed-in') return

    setIsRocketVisible(true)

    await sleep(ROCKET_ANIMATION_DELAY)

    rocketAnimationRef.current?.restart()

    await sleep(3000) // 3 seconds

    if (nextRoute) {
      router.goTo(nextRoute)
      return
    }

    router.goTo(ROUTES.space)
  }

  async function handleResendEmail() {
    if (!unconfirmedEmail) return

    setIsResendingEmail(true)

    const response = await authService
      .resendSignUpEmail(Email.create(unconfirmedEmail))
      .finally(() => setIsResendingEmail(false))

    if (response.isFailure) return toast.showError(response.errorMessage, 5)

    toast.showSuccess('Reenviamos para você o e-mail de confirmação', 10)
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
    unconfirmedEmail,
    isResendingEmail,
    handleFormSubmit,
    handleResendEmail,
  }
}
