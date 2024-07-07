'use client'

import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useToastContext } from '@/modules/global/contexts/ToastContext'
import { ROUTES } from '@/modules/global/constants'
import { ROCKET_ANIMATION_DELAY } from '@/modules/auth/constants'

import { SignInForm } from '@/infra/forms/types'
import { useSignInForm } from '@/infra/forms'
import { waitFor } from '@/modules/global/utils'

export function useSignInPage() {
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const [isLaoding, setIsLoading] = useState(false)

  const { handleSignIn } = useAuthContext()
  const router = useRouter()
  const toast = useToastContext()

  const { errors, handleSubmit, register } = useSignInForm()

  const rocketRef = useRef(null) as LottieRef

  async function handleFormSubmit({ email, password }: SignInForm) {
    setIsLoading(true)

    const isSuccess = await handleSignIn(email, password)

    setIsLoading(false)

    if (!isSuccess) return

    setIsRocketVisible(true)

    await waitFor(ROCKET_ANIMATION_DELAY)

    rocketRef.current?.goToAndPlay(0)

    await waitFor(3000) // 3 seconds

    router.push(ROUTES.private.app.home.space)
  }

  useEffect(() => {
    const url = window.location.href
    if (url.includes('error')) {
      const errorMessage = url.split('error')[-1]
      toast.show(errorMessage, {
        type: 'error',
        seconds: 2.5,
      })
    }
  }, [toast])

  return {
    rocketRef,
    errors,
    isLaoding,
    isRocketVisible,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
