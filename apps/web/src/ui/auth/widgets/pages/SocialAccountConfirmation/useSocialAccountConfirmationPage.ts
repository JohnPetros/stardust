import { type RefObject, useCallback, useEffect, useState } from 'react'

import type { Account } from '@stardust/core/auth/entities'
import type { UserCreatedEvent } from '@stardust/core/profile/events'

import { ROUTES } from '@/constants'
import { useHashParam } from '@/ui/global/hooks/useHashParam'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useSleep } from '@/ui/global/hooks/useSleep'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

type Params = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  account: Account | null
  handleSignUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<{ isNewAccount: boolean }>
}

export function useSocialAccountConfirmationPage({
  rocketAnimationRef,
  account,
  handleSignUpWithSocialAccount,
}: Params) {
  const accessToken = useHashParam('access_token')
  const refreshToken = useHashParam('refresh_token')
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [isUserCreated, setIsUserCreated] = useState(false)
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const { sleep } = useSleep()
  const router = useRouter()

  function handleUserCreated(event: UserCreatedEvent) {
    if (event.payload.userEmail === account?.email?.value) {
      setIsUserCreated(true)
    }
  }

  const showRocketAnimation = useCallback(async () => {
    setIsRocketVisible(true)
    await sleep(ROCKET_ANIMATION_DELAY)
    rocketAnimationRef.current?.restart()
    await sleep(3000)
    router.goTo(ROUTES.space)
  }, [sleep, rocketAnimationRef, router])

  useEffect(() => {
    async function signUpWithSocialAccount() {
      await sleep(2000)
      if (!accessToken || !refreshToken) return

      const { isNewAccount } = await handleSignUpWithSocialAccount(
        accessToken,
        refreshToken,
      )
      console.log('isNewAccount', isNewAccount)
      setIsNewAccount(isNewAccount)
      if (!isNewAccount) showRocketAnimation()
    }

    signUpWithSocialAccount()
  }, [accessToken, refreshToken])

  return {
    isNewAccount,
    isUserCreated,
    isRocketVisible,
    handleLinkClick: showRocketAnimation,
    handleUserCreated,
  }
}
