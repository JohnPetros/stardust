'use client'

import { type RefObject, useEffect, useState } from 'react'

import type { AnimationRef } from '@/ui/global/components/shared/Animation/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { ROUTES } from '@/ui/global/constants'
import { waitFor } from '@/ui/global/utils'
import { useRouter } from '@/ui/global/hooks'
import type { SignInFormFields } from '@/ui/auth/forms/types'
import { Slug } from '@/@core/domain/structs/Slug'

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

    router.goTo(ROUTES.private.app.accountConfirmation)
  }

  useEffect(() => {
    if (url.includes('error=')) {
      const errorMessage = url.split('error=').at(-1)
      if (!errorMessage) return

      toast.show(Slug.deslugify(errorMessage), {
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
