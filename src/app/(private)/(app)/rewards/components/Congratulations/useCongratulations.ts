'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { CongratulationsProps } from '.'

import { AlertRef } from '@/app/components/Alert'
import { deleteCookie } from '@/app/server/actions/deleteCookie'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { COOKIES } from '@/utils/constants'
import { playAudio } from '@/utils/helpers'

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

  const alertRef = useRef<AlertRef>(null)
  const starsChainRef = useRef(null) as LottieRef

  const router = useRouter()

  function handleFirstButtonClick() {
    setIsFirstClick(false)

    if (updatedLevel.hasNewLevel) {
      alertRef.current?.open()
    }

    const shouldStreakBeVisible = todayStatus == 'todo'

    if (shouldStreakBeVisible) {
      setIsStreakVisible(true)
      return
    }

    setIsEndMessageVisible(true)
  }

  const exit = useCallback(async () => {
    setIsLoading(true)
    await deleteCookie(COOKIES.rewardsPayload)

    mutateUserCache({ coins, xp, level: updatedLevel.level })
    router.push(nextRoute)
  }, [router, nextRoute, coins, xp, updatedLevel, mutateUserCache])

  async function handleSecondButtonClick() {
    await exit()
  }

  useEffect(() => {
    async function handlePageRefresh(event: BeforeUnloadEvent) {
      event.preventDefault()
      await exit()
    }

    window.addEventListener('beforeunload', handlePageRefresh)

    return () => window.removeEventListener('beforeunload', handlePageRefresh)
  }, [exit])

  useEffect(() => {
    playAudio('earning.wav')
  }, [])

  return {
    isFirstClick,
    isStreakVisible,
    isEndMessageVisible,
    isLoading,
    alertRef,
    starsChainRef,
    handleSecondButtonClick,
    handleFirstButtonClick,
  }
}
