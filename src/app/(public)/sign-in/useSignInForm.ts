'use client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { SignInFormFields, signInFormSchema } from '@/libs/zod'
import { ROCKET_ANIMATION_DELAY, ROUTES } from '@/utils/constants'
import { getSearchParams } from '@/utils/helpers/getSearchParams'

export function useSignInForm() {
  const [isRocketVisible, setIsRocketVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
  })

  const { signIn } = useAuth()
  const [isLaoding, setIsLoading] = useState(false)

  const router = useRouter()

  const toastRef = useRef<ToastRef>(null)
  const rocketRef = useRef(null) as LottieRef

  async function launchRocket() {
    await new Promise((resolve) =>
      setTimeout(() => {
        rocketRef.current?.goToAndPlay(0)
        resolve(true)
      }, ROCKET_ANIMATION_DELAY * 1000)
    )
  }

  async function handleFormData({ email, password }: SignInFormFields) {
    const error = await signIn(email, password)

    if (error) {
      if (error === 'Invalid login credentials') {
        toastRef.current?.open({
          type: 'success',
          message: 'Usuário não encontrado',
          seconds: 2.5,
        })
        return
      }

      console.error(error)
      return
    }

    setIsLoading(true)

    setIsRocketVisible(true)

    await launchRocket()

    setTimeout(
      () => {
        router.push(ROUTES.private.home)
      },
      ROCKET_ANIMATION_DELAY * 1000 + 2500
    )
  }

  useEffect(() => {
    const error = getSearchParams(
      window.location.href.replace('#', '?'),
      'error'
    )

    if (error?.includes('unauthorized')) {
      toastRef.current?.open({
        type: 'error',
        message: 'Error ao autenticar perfil, tente novamente mais tarde.',
        seconds: 5,
      })
    }

    if (error?.includes('email_confirmation_error')) {
      toastRef.current?.open({
        type: 'error',
        message: 'Error ao tentar confirmar e-mail.',
        seconds: 5,
      })
    }
  }, [])

  return {
    toastRef,
    rocketRef,
    errors,
    isLaoding,
    isRocketVisible,
    register,
    handleSubmit: handleSubmit(handleFormData),
  }
}
