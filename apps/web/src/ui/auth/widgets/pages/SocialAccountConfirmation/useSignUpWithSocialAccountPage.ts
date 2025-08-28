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
  signUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<ActionResponse<{ isNewAccount: boolean }>>
  refetchUser: () => void
}

export function useSignUpWithSocialAccountPage({
  rocketAnimationRef,
  signUpWithSocialAccount,
  refetchUser,
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
    async function handleSignUpWithSocialAccount() {
      if (!accessToken || !refreshToken) return
      const response = await signUpWithSocialAccount(accessToken, refreshToken)

      if (response.isSuccessful) {
        const isNewAccount = response.data.isNewAccount
        refetchUser()
        setIsNewAccount(isNewAccount)
        if (!isNewAccount) showRocketAnimation()
      }
    }

    handleSignUpWithSocialAccount()
  }, [
    signUpWithSocialAccount,
    showRocketAnimation,
    accessToken,
    refreshToken,
    refetchUser,
  ])

  return {
    isNewAccount,
    isRocketVisible,
    handleLinkClick: showRocketAnimation,
  }
}
