import { type RefObject, useState } from 'react'

import { ROUTES } from '@/constants'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useRouter } from '@/ui/global/hooks/useRouter'

export function useAccountConfirmationPage(
  rocketAnimationRef: RefObject<AnimationRef | null>,
) {
  const { sleep } = useSleep()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const router = useRouter()

  async function handleLinkClick() {
    setIsRocketVisible(true)
    await sleep(ROCKET_ANIMATION_DELAY)
    rocketAnimationRef.current?.restart()
    await sleep(3000)
    router.goTo(ROUTES.space)
  }

  return {
    isRocketVisible,
    handleLinkClick,
  }
}
