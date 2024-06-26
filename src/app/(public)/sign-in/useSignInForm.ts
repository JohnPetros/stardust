'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { OAuthProvider } from '@/contexts/AuthContext/types/OAuthProvider'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { ROCKET_ANIMATION_DELAY, ROUTES } from '@/global/constants'
import { getSearchParams } from '@/global/helpers/getSearchParams'
import { useValidation } from '@/services/validation'
import { SignInForm } from '@/services/validation/types/signInForm'

export function useSignInForm() {
  const [isRocketVisible, setIsRocketVisible] = useState(false)

  const validation = useValidation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: validation.resolveSignInForm(),
  })

  const { signIn, signInWithOAuth } = useAuthContext()
  const [isLaoding, setIsLoading] = useState(false)

  const router = useRouter()
  const toast = useToastContext()

  const rocketRef = useRef(null) as LottieRef

  async function launchRocket() {
    await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_ANIMATION_DELAY * 1000)
    )
  }

  async function handleOAuth(oauthProvider: OAuthProvider) {
    await signInWithOAuth(oauthProvider)
  }

  async function handleFormData({ email, password }: SignInForm) {
    try {
      await signIn(email, password)
    } catch (error) {
      toast.show('Usuário não encontrado', {
        type: 'error',
        seconds: 2.5,
      })
      return
    }

    setIsLoading(true)

    setIsRocketVisible(true)

    await launchRocket()

    setTimeout(
      () => {
        router.push(ROUTES.private.home.space)
      },
      ROCKET_ANIMATION_DELAY * 1000 + 2500
    )
  }

  useEffect(() => {
    const error = getSearchParams(
      window.location.href.replace('#', '?'),
      'error'
    )

    if (error?.includes('email_confirmation_error')) {
      toast.show('Error ao autenticar perfil, tente novamente mais tarde', {
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
    handleSubmit: handleSubmit(handleFormData),
    handleOAuth,
  }
}
