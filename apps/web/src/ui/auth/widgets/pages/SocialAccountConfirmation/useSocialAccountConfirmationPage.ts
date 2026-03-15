import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

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
  onRetryUserCreation: () => Promise<boolean>
  onSignUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<{ isNewAccount: boolean }>
}

const RETRY_VISIBILITY_DELAY_IN_MS = 7000

export function useSocialAccountConfirmationPage({
  rocketAnimationRef,
  account,
  profileChannel,
  onRetryUserCreation,
  onSignUpWithSocialAccount,
}: Params) {
  const accessToken = useHashParam('access_token')
  const refreshToken = useHashParam('refresh_token')
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [isUserCreated, setIsUserCreated] = useState(false)
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const [isRetryVisible, setIsRetryVisible] = useState(false)
  const [isRetryingUserCreation, setIsRetryingUserCreation] = useState(false)
  const hasHandledSignUpRef = useRef(false)
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
      if (hasHandledSignUpRef.current) return
      await sleep(2000)
      if (!accessToken || !refreshToken) return

      hasHandledSignUpRef.current = true

      const { isNewAccount } = await onSignUpWithSocialAccount(accessToken, refreshToken)
      console.log({ isNewAccount })
      setIsNewAccount(isNewAccount)
      setIsUserCreated(!isNewAccount)

      if (!isNewAccount) showRocketAnimation()
    }

    signUpWithSocialAccount()
  }, [])

  useEffect(() => {
    return profileChannel.onCreateUser((event: UserCreatedEvent) => {
      if (event.payload.userEmail === account?.email?.value) {
        setIsUserCreated(true)
      }
    })
  }, [account?.email?.value, profileChannel])

  useEffect(() => {
    if (!isNewAccount || isUserCreated) {
      setIsRetryVisible(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsRetryVisible(true)
    }, RETRY_VISIBILITY_DELAY_IN_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isNewAccount, isUserCreated])

  const handleRetryUserCreation = useCallback(async () => {
    setIsRetryingUserCreation(true)

    await onRetryUserCreation()
    setIsRetryingUserCreation(false)
  }, [onRetryUserCreation])

  return {
    isNewAccount,
    isUserCreated,
    isRocketVisible,
    isRetryVisible,
    isRetryingUserCreation,
    handleLinkClick: showRocketAnimation,
    handleRetryUserCreation,
  }
}
