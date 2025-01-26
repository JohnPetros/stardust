'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { _deleteCookie, _setCookie } from '@/ui/global/actions'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useRefreshPage } from '@/ui/global/hooks/useRefreshPage'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'

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
    setIsLoading(true)
    router.goTo(nextRoute)
  }, [nextRoute, router.goTo])

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
