'use client'

import { type RefObject, useCallback, useEffect, useState } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useRefreshPage } from '@/ui/global/hooks/useRefreshPage'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { COOKIES } from '@/constants'

type UseRewardingPageProps = {
  newLevel: number | null
  newStreak: number | null
  nextRoute: string
  newLevelAlertDialogRef: RefObject<AlertDialogRef | null>
}

export function useRewardingPage({
  newLevel,
  newStreak,
  nextRoute,
  newLevelAlertDialogRef,
}: UseRewardingPageProps) {
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { playAudio } = useAudioContext()
  const { refetchUser } = useAuthContext()
  const { deleteCookie } = useCookieActions()
  const router = useNavigationProvider()

  function handleFirstButtonClick() {
    if (!newStreak && !newLevel) {
      setIsEndMessageVisible(true)
      setIsFirstClick(false)
      return
    }

    if (newLevel) {
      newLevelAlertDialogRef.current?.open()
      return
    }

    if (newStreak) {
      setIsStreakVisible(true)
      setIsFirstClick(false)
    }
  }

  function handleNewLevelAlertDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      if (newStreak) setIsStreakVisible(true)
      setIsFirstClick(false)
    }
  }

  const goToNextRoute = useCallback(async () => {
    setIsLoading(true)
    router.goTo(nextRoute)
  }, [nextRoute, router.goTo])

  async function handleSecondButtonClick() {
    await deleteCookie(COOKIES.keys.rewardingPayload)
    goToNextRoute()
  }

  useRefreshPage(handleSecondButtonClick)

  useEffect(() => {
    refetchUser()
    playAudio('earning.wav')
  }, [])

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
    handleSecondButtonClick,
    handleFirstButtonClick,
    handleNewLevelAlertDialogOpenChange,
  }
}
