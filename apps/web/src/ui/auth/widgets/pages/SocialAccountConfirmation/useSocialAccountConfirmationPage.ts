import { type RefObject, useCallback, useEffect, useState } from 'react'

import type { Account } from '@stardust/core/auth/entities'
import type { UserCreatedEvent } from '@stardust/core/profile/events'

import { ROUTES } from '@/constants'
import { useHashParam } from '@/ui/global/hooks/useHashParam'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSleep } from '@/ui/global/hooks/useSleep'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import type { ProfileChannel } from '@stardust/core/profile/interfaces'

type Params = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  account: Account | null
  profileChannel: ProfileChannel
  onSignUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<{ isNewAccount: boolean }>
}

export function useSocialAccountConfirmationPage({
  rocketAnimationRef,
  account,
  profileChannel,
  onSignUpWithSocialAccount,
}: Params) {
  const accessToken = useHashParam('access_token')
  const refreshToken = useHashParam('refresh_token')
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [isUserCreated, setIsUserCreated] = useState(false)
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const { sleep } = useSleep()
  const router = useNavigationProvider()

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

      const { isNewAccount } = await onSignUpWithSocialAccount(accessToken, refreshToken)
      setIsNewAccount(isNewAccount)
      if (!isNewAccount) showRocketAnimation()
    }

    signUpWithSocialAccount()
  }, [accessToken, refreshToken])

  useEffect(() => {
    return profileChannel.onCreateUser((event: UserCreatedEvent) => {
      if (event.payload.userEmail === account?.email?.value) {
        setIsUserCreated(true)
      }
    })
  }, [account?.email?.value, profileChannel])

  return {
    isNewAccount,
    isUserCreated,
    isRocketVisible,
    handleLinkClick: showRocketAnimation,
  }
}
