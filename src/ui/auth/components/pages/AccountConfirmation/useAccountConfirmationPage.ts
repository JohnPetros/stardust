import { RefObject, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/ui/global/contexts/AuthContext'
import type { AnimationRef } from '@/ui/global/components/shared/Animation/types'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { ROUTES } from '@/ui/global/constants'
import { waitFor } from '@/ui/global/utils'

export function useAccountConfirmationPage(rocketAnimationRef: RefObject<AnimationRef>) {
  const { user } = useAuthContext()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const router = useRouter()

  async function handleLinkClick() {
    setIsRocketVisible(true)

    await waitFor(ROCKET_ANIMATION_DELAY)

    rocketAnimationRef.current?.restart()

    await waitFor(3000)

    router.push(ROUTES.private.app.home.space)
  }

  return {
    user,
    isRocketVisible,
    handleLinkClick,
  }
}
