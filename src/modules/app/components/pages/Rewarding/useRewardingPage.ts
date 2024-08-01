'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { User } from '@/@core/domain/entities'

import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { _deleteCookie } from '@/modules/global/actions'
import { COOKIES } from '@/modules/global/constants'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useRouter } from '@/modules/global/hooks'
import { useRefreshPage } from '@/modules/global/hooks/useRefreshPage'
import { playAudio } from '@/modules/global/utils'

export function useRewardingPage(user: User, nextRoute: string) {
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateUser } = useAuthContext()
  const alertDialogRef = useRef<AlertDialogRef>(null)
  const router = useRouter()

  function handleFirstButtonClick() {
    setIsFirstClick(false)

    if (user.level.didUp.isTrue) {
      alertDialogRef.current?.open()
    }

    const shouldStreakBeVisible = user.weekStatus.todayStatus === 'todo'

    if (shouldStreakBeVisible) {
      setIsStreakVisible(true)
      return
    }

    setIsEndMessageVisible(true)
  }

  const goToNextRoute = useCallback(async () => {
    await Promise.all([updateUser(user), _deleteCookie(COOKIES.keys.rewardingPayload)])
    setIsLoading(true)

    router.goTo(nextRoute)
  }, [nextRoute, user, router.goTo, updateUser])

  async function handleSecondButtonClick() {
    await goToNextRoute()
  }

  useRefreshPage(handleSecondButtonClick)

  useEffect(() => {
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
    alertDialogRef,
    handleSecondButtonClick,
    handleFirstButtonClick,
  }
}
