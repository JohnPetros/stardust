'use client'

import { useEffect, useRef, useState } from 'react'
import { LottieRef } from 'lottie-react'
import { useRouter } from 'next/navigation'

import { CongratulationsProps } from '.'

import { AlertRef } from '@/app/components/Alert'
import { deleteCookie } from '@/app/server/actions/deleteCookie'
import { COOKIES } from '@/utils/constants'
import { playAudio } from '@/utils/helpers/'

export function useCongratulations({
  accurance,
  todayStatus,
  updatedLevel,
  nextRoute,
}: Omit<CongratulationsProps, 'time'>) {
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  async function handleSecondButtonClick() {
    setIsLoading(true)
    await deleteCookie(COOKIES.rewardsPayload)
    router.push(nextRoute)
  }

  useEffect(() => {
    function pauseStarsAnimation() {
      const totalStars = (parseInt(accurance) * 5) / 100

      starsChainRef.current?.goToAndPlay(0)

      const delay = 500 * (!isNaN(totalStars) ? totalStars : 5)

      setTimeout(() => {
        starsChainRef.current?.pause()
      }, delay)
    }

    playAudio('earning.wav')
    pauseStarsAnimation()
  }, [accurance])

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
