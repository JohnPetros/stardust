'use client'

import { useEffect, useRef, useState } from 'react'
import type { SwiperRef } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { register } from 'swiper/element'
import { useAnimate } from 'motion/react'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types/ChallengeContent'
import type { TabHandler } from '@/ui/challenging/stores/ChallengeStore/types/TabHandler'

register()

type Params = {
  tabHandler: TabHandler | null
  activeContent: ChallengeContent
  isMobile: boolean
  slidesCount: number
  onSetTabHandler: (tabHandler: TabHandler) => void
}

export function useChallengeSlider({
  tabHandler,
  activeContent,
  isMobile,
  slidesCount,
  onSetTabHandler,
}: Params) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [motionScope, animate] = useAnimate()
  const swiperRef = useRef<SwiperRef>(null)

  function handleNavButtonClick(slideIndex: number) {
    swiperRef.current?.swiper.slideTo(slideIndex)
  }

  function handleSlideChange(swiper: SwiperInstance) {
    animate(
      motionScope.current,
      { x: Math.abs(swiper.translate / slidesCount) },
      { ease: 'linear', duration: 0.2 },
    )
    setActiveSlideIndex(swiper.activeIndex)
  }

  useEffect(() => {
    function showResultTab() {
      swiperRef.current?.swiper.slideTo(2)
    }

    function showCodeTab() {
      swiperRef.current?.swiper.slideTo(1)
    }

    function showAssistantTab() {
      swiperRef.current?.swiper.slideTo(3)
    }

    if (!tabHandler && isMobile) {
      onSetTabHandler({
        showResultTab,
        showCodeTab,
        showAssistantTab,
      })
    }

    if (activeContent === 'result') {
      showResultTab()
    }
  }, [onSetTabHandler, tabHandler, isMobile, activeContent])

  return {
    swiperRef,
    motionScope,
    activeContent,
    activeSlideIndex,
    handleNavButtonClick,
    handleSlideChange,
  }
}
