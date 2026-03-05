'use client'

import type { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeSlider } from './useChallengeSlider'

const ChallengeSliderView = dynamic(
  () => import('./ChallengeSliderView').then((module) => module.ChallengeSliderView),
  { ssr: false },
)

export const ChallengeSlider = ({ children }: PropsWithChildren) => {
  const { getTabHandlerSlice, getActiveContentSlice } = useChallengeStore()
  const { tabHandler, setTabHandler } = getTabHandlerSlice()
  const { activeContent } = getActiveContentSlice()
  const { md: isMobile } = useBreakpoint()
  const slidesCount = 4
  const {
    swiperRef,
    motionScope,
    activeSlideIndex,
    handleNavButtonClick,
    handleSlideChange,
  } = useChallengeSlider({
    tabHandler,
    activeContent,
    isMobile,
    slidesCount,
    onSetTabHandler: setTabHandler,
  })

  return (
    <ChallengeSliderView
      swiperRef={swiperRef}
      motionScope={motionScope}
      activeSlideIndex={activeSlideIndex}
      activeContent={activeContent}
      slidesCount={slidesCount}
      handleNavButtonClick={handleNavButtonClick}
      handleSlideChange={handleSlideChange}
    >
      {children}
    </ChallengeSliderView>
  )
}
