import { RefObject, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import type { AnimationRef } from '@/modules/global/components/shared/Animation/types'
import { ROCKET_ANIMATION_DELAY } from '@/modules/auth/constants'
import { ROUTES } from '@/modules/global/constants'
import { waitFor } from '@/modules/global/utils'

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
