'use client'

import { type RefObject, useEffect, useState } from 'react'

import { Slug } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { SignInFormFields } from './SignInForm/types'

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
  const router = useRouter()

  async function handleFormSubmit({ email, password }: SignInFormFields) {
    const isSuccess = await handleSignIn(email, password)
    if (!isSuccess) return

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
