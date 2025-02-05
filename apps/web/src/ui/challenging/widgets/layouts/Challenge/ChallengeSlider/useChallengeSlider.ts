'use client'

import { useEffect, useRef, useState } from 'react'
import type { SwiperRef } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { register } from 'swiper/element'
import { useAnimate } from 'framer-motion'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'

register()

export function useChallengeSlider() {
  const { getTabHandlerSlice, getActiveContentSlice } = useChallengeStore()
  const { tabHandler, setTabHandler } = getTabHandlerSlice()
  const { activeContent } = getActiveContentSlice()
  const { md: isMobile } = useBreakpoint()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [motionScope, animate] = useAnimate()
  const swiperRef = useRef<SwiperRef>(null)

  function handleNavButtonClick(slideIndex: number) {
    swiperRef.current?.swiper.slideTo(slideIndex)
  }

  function handleSlideChange(swiper: SwiperInstance) {
    animate(
      motionScope.current,
      { x: Math.abs(swiper.translate / 3) },
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

    if (!tabHandler && isMobile)
      setTabHandler({
        showResultTab,
        showCodeTab,
      })

    if (activeContent === 'result') showResultTab()
  }, [setTabHandler, tabHandler, isMobile, activeContent])

  return {
    swiperRef,
    motionScope,
    activeContent,
    activeSlideIndex,
    handleNavButtonClick,
    handleSlideChange,
  }
}
