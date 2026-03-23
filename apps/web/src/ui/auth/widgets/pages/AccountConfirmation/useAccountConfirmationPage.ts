import { type RefObject, useCallback, useEffect, useState } from 'react'

import type { Account } from '@stardust/core/auth/entities'
import type { User } from '@stardust/core/global/entities'
import type { UserCreatedEvent } from '@stardust/core/profile/events'
import type { ProfileChannel } from '@stardust/core/profile/interfaces'

import { ROUTES } from '@/constants'
import { ROCKET_ANIMATION_DELAY } from '@/ui/auth/constants'
import { useSleep } from '@/ui/global/hooks/useSleep'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

const RETRY_VISIBILITY_DELAY_IN_MS = 7000

type Params = {
  rocketAnimationRef: RefObject<AnimationRef | null>
  account: Account | null
  user: User | null
  profileChannel: ProfileChannel
  onRefetchUser: () => void
  onRetryUserCreation: () => Promise<boolean>
}

export function useAccountConfirmationPage({
  rocketAnimationRef,
  account,
  user,
  profileChannel,
  onRefetchUser,
  onRetryUserCreation,
}: Params) {
  const { sleep } = useSleep()
  const [isRocketVisible, setIsRocketVisible] = useState(false)
  const [isRetryVisible, setIsRetryVisible] = useState(false)
  const [isRetryingUserCreation, setIsRetryingUserCreation] = useState(false)
  const router = useNavigationProvider()

  const handleLinkClick = useCallback(async () => {
    setIsRocketVisible(true)
    await sleep(ROCKET_ANIMATION_DELAY)
    rocketAnimationRef.current?.restart()
    await sleep(3000)
    router.goTo(ROUTES.space)
  }, [sleep, rocketAnimationRef, router])

  const handleRetryUserCreation = useCallback(async () => {
    setIsRetryingUserCreation(true)

    await onRetryUserCreation()
    setIsRetryingUserCreation(false)
  }, [onRetryUserCreation])

  useEffect(() => {
    if (user) {
      setIsRetryVisible(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsRetryVisible(true)
    }, RETRY_VISIBILITY_DELAY_IN_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [user])

  useEffect(() => {
    if (!account) return

    return profileChannel.onCreateUser((event: UserCreatedEvent) => {
      if (event.payload.userEmail !== account.email.value) return
      onRefetchUser()
    })
  }, [account, profileChannel, onRefetchUser])

  return {
    isRocketVisible,
    isRetryVisible,
    isRetryingUserCreation,
    handleLinkClick,
    handleRetryUserCreation,
  }
}
