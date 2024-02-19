'use client'

import { LottieRef } from 'lottie-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { CongratulationsProps } from '.'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { _deleteCookie } from '@/global/actions/_deleteCookie'
import { AlertDialogRef } from '@/global/components/AlertDialog/types/AlertDialogRef'
import { COOKIES } from '@/global/constants'
import { playAudio } from '@/global/helpers'
import { useEventListener } from '@/global/hooks/useEventListener'
import { useRefreshPage } from '@/global/hooks/useRefreshPage'

export function useCongratulations({
  coins,
  xp,
  todayStatus,
  updatedLevel,
  nextRoute,
}: Omit<CongratulationsProps, 'time'>) {
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { mutateUserCache } = useAuthContext()


  const alertDialogRef = useRef<AlertDialogRef>(null)
  const starsChainRef = useRef(null) as LottieRef

  const router = useRouter()
  const pathname = usePathname()

  function handleFirstButtonClick() {
    setIsFirstClick(false)

    if (updatedLevel.hasNewLevel) {
      alertDialogRef.current?.open()
    }

    const shouldStreakBeVisible = todayStatus === 'todo'

    if (shouldStreakBeVisible) {
      setIsStreakVisible(true)
      return
    }

    setIsEndMessageVisible(true)
  }

  const exit = useCallback(async () => {
    setIsLoading(true)
    await _deleteCookie(COOKIES.keys.rewardsPayload)

    mutateUserCache({ coins, xp, level: updatedLevel.level })
    router.push(nextRoute)
  }, [router, nextRoute, coins, xp, updatedLevel, mutateUserCache])

  async function handleSecondButtonClick() {
    await exit()
  }

  async function handleBack() {
    alert('back')
  }

  useRefreshPage(handleSecondButtonClick)


  useEffect(() => {
    playAudio('earning.wav')
  }, [])

  useEffect(() => {
    history.pushState(null, '', location.href)
    window.onpopstate = () => {
      history.go(1)
    };
  }, []);

  return {
    isFirstClick,
    isStreakVisible,
    isEndMessageVisible,
    isLoading,
    alertDialogRef,
    starsChainRef,
    handleSecondButtonClick,
    handleFirstButtonClick,
  }
}
