'use client'

import { RefObject, useEffect, useState } from 'react'

import type { AnimationRef } from '@/modules/global/components/shared/Animation/types'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useToastContext } from '@/modules/global/contexts/ToastContext'
import { ROCKET_ANIMATION_DELAY } from '@/modules/auth/constants'
import { ROUTES } from '@/modules/global/constants'
import { waitFor } from '@/modules/global/utils'
import { useRouter } from '@/modules/global/hooks'
import { SignInFormFields } from '@/infra/forms/types'

export function useSignInPage(url: string, rocketAnimationRef: RefObject<AnimationRef>) {
  const [isRocketVisible, setIsRocketVisible] = useState(false)

  const { handleSignIn } = useAuthContext()
  const toast = useToastContext()
  const router = useRouter()

  async function handleFormSubmit({ email, password }: SignInFormFields) {
    const isSuccess = await handleSignIn(email, password)

    if (!isSuccess) return

    setIsRocketVisible(true)

    await waitFor(ROCKET_ANIMATION_DELAY)

    rocketAnimationRef.current?.restart()

    await waitFor(3000) // 3 seconds

    router.goTo(ROUTES.private.app.home.space)
  }

  useEffect(() => {
    if (url.includes('error=')) {
      const errorMessage = url.split('error=').at(-1)
      if (!errorMessage) return

      toast.show(errorMessage, {
        type: 'error',
        seconds: 2.5,
      })
    }
  }, [url, toast])

  return {
    rocketAnimationRef,
    isRocketVisible,
    handleFormSubmit,
  }
}
