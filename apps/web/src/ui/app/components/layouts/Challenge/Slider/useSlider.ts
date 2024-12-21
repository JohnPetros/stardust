'use client'

import { useEffect, useRef, useState } from 'react'
import type { SwiperRef } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import { useAnimate } from 'framer-motion'
import { useBreakpoint } from '@/ui/global/hooks'
import { useChallengeStore } from '@/ui/app/stores/ChallengeStore'
import { register } from 'swiper/element'
register()

export function useSlider() {
  const { getTabHandlerSlice } = useChallengeStore()
  const { tabHandler, setTabHandler } = getTabHandlerSlice()
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
  }, [setTabHandler, tabHandler, isMobile])

  return {
    swiperRef,
    motionScope,
    activeSlideIndex,
    handleNavButtonClick,
    handleSlideChange,
  }
}
