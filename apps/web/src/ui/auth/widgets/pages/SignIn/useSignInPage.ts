'use client'

import { type RefObject, useEffect, useState } from 'react'

import { Slug } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { SignInFormFields } from './SignInForm/types'

export function useSignInPage(url: string, rocketAnimationRef: RefObject<AnimationRef>) {
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const [nextRoute] = useQueryStringParam('nextRoute')
  const { sleep } = useSleep()
  const { handleSignIn } = useAuthContext()
  const toast = useToastContext()
  const router = useRouter()
  NextRestClient()

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
    if (url.includes('error=')) {
      const errorMessage = url.split('error=').at(-1)
      if (!errorMessage) return

      toast.show(Slug.deslugify(errorMessage), {
        type: 'error',
        seconds: 3.5,
      })
    }
  }, [url, toast])

  return {
    rocketAnimationRef,
    isRocketVisible,
    handleFormSubmit,
  }
}
