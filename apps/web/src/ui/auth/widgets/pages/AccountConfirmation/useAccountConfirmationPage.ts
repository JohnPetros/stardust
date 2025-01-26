'use client'

import { type RefObject, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export function useAccountConfirmationPage(rocketAnimationRef: RefObject<AnimationRef>) {
  const { user } = useAuthContext()
  const { sleep } = useSleep()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const router = useRouter()

  async function handleLinkClick() {
    setIsRocketVisible(true)
    await sleep(ROCKET_ANIMATION_DELAY)
    rocketAnimationRef.current?.restart()
    await sleep(3000)
    router.push(ROUTES.space)
  }

  return {
    user,
    isRocketVisible,
    handleLinkClick,
  }
}
