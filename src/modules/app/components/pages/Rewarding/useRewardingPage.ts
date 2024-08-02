'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { _deleteCookie, _setCookie } from '@/modules/global/actions'
import { COOKIES } from '@/modules/global/constants'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useRouter } from '@/modules/global/hooks'
import { useRefreshPage } from '@/modules/global/hooks/useRefreshPage'
import { useAudioContext } from '@/modules/app/contexts/AudioContext'

export function useRewardingPage(newLevel: number | null, nextRoute: string) {
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, updateUser } = useAuthContext()
  const { playAudio } = useAudioContext()
  const alertDialogRef = useRef<AlertDialogRef>(null)
  const router = useRouter()

  function handleFirstButtonClick() {
    setIsFirstClick(false)

    if (newLevel) {
      alertDialogRef.current?.open()
    }

    if (user?.canMakeTodayStatusDone.isTrue) {
      setIsStreakVisible(true)
      return
    }

    setIsEndMessageVisible(true)
  }

  const goToNextRoute = useCallback(async () => {
    // _deleteCookie(COOKIES.keys.rewardingPayload)
    setIsLoading(true)

    router.goTo(nextRoute)
  }, [nextRoute, user, router.goTo, updateUser])

  async function handleSecondButtonClick() {
    await goToNextRoute()
  }

  useRefreshPage(handleSecondButtonClick)

  useEffect(() => {
    playAudio('earning.wav')
  }, [playAudio])

  useEffect(() => {
    history.pushState(null, '', location.href)
    window.onpopstate = () => {
      history.go(1)
    }
  }, [])

  return {
    isFirstClick,
    isStreakVisible,
    isEndMessageVisible,
    isLoading,
    alertDialogRef,
    handleSecondButtonClick,
    handleFirstButtonClick,
  }
}
