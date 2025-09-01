import { RefObject, useCallback, useEffect, useState } from 'react'

import type { ActionResponse } from '@stardust/core/global/responses'

import { useHashParam } from '@/ui/global/hooks/useHashParam'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useSleep } from '@/ui/global/hooks/useSleep'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { ROUTES } from '@/constants'

type Params = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  handleSignUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<{ isNewAccount: boolean }>
  refetchUser: () => void
}

export function useSocialAccountConfirmationPage({
  rocketAnimationRef,
  handleSignUpWithSocialAccount,
}: Params) {
  const accessToken = useHashParam('access_token')
  const refreshToken = useHashParam('refresh_token')
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const { sleep } = useSleep()
  const router = useRouter()

  const showRocketAnimation = useCallback(async () => {
    setIsRocketVisible(true)
    await sleep(ROCKET_ANIMATION_DELAY)
    rocketAnimationRef.current?.restart()
    await sleep(3000)
    router.goTo(ROUTES.space)
  }, [sleep, rocketAnimationRef, router])

  useEffect(() => {
    async function signUpWithSocialAccount() {
      if (!accessToken || !refreshToken) return

      const { isNewAccount } = await handleSignUpWithSocialAccount(
        accessToken,
        refreshToken,
      )
      setIsNewAccount(isNewAccount)
      if (!isNewAccount) showRocketAnimation()
    }

    signUpWithSocialAccount()
  }, [accessToken, refreshToken])

  return {
    isNewAccount,
    isRocketVisible,
    handleLinkClick: showRocketAnimation,
  }
}
