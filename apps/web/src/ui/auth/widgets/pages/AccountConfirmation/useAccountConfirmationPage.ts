import { type RefObject, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/constants'
import { waitFor } from '@/utils'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

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
