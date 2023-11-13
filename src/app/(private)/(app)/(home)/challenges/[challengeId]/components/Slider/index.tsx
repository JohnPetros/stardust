'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper as SwiperInstance } from 'swiper'
import { register } from 'swiper/element/bundle'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'

import { Code } from '../Code'
import { Problem } from '../Problem'
import { Result } from '../Result'

import { NavButton } from './NavButton'

register()
import { motion, useAnimate } from 'framer-motion'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useChallengeStore } from '@/stores/challengeStore'

export function Slider() {
  const {
    state: { tabHandler },
    actions: { setTabHandler },
  } = useChallengeStore()
  const { md: isMobile } = useBreakpoint()

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [scope, animate] = useAnimate()
  const sliderRef = useRef<SwiperRef>(null)

  function handleNavButtonClick(slideIndex: number) {
    sliderRef.current?.swiper.slideTo(slideIndex)
  }

  function handleSlideChange(swiper: SwiperInstance) {
    animate(
      scope.current,
      { x: Math.abs(swiper.translate / 3) },
      { ease: 'linear', duration: 0.2 }
    )
    setActiveSlideIndex(swiper.activeIndex)
  }

  useEffect(() => {
    function showResultTab() {
      sliderRef.current?.swiper.slideTo(2)
    }

    function showCodeTab() {
      sliderRef.current?.swiper.slideTo(1)
    }

    if (!tabHandler && isMobile)
      setTabHandler({
        showResultTab,
        showCodeTab,
      })
  }, [setTabHandler, tabHandler, isMobile])

  return (
    <div>
      <nav className="bg-gray-900">
        <ul className="relative grid grid-cols-3">
          <li>
            <NavButton
              isActive={activeSlideIndex === 0}
              onClick={() => handleNavButtonClick(0)}
            >
              Problema
            </NavButton>
          </li>
          <li>
            <NavButton
              isActive={activeSlideIndex === 1}
              onClick={() => handleNavButtonClick(1)}
            >
              Código
            </NavButton>
          </li>
          <li>
            <NavButton
              isActive={activeSlideIndex === 2}
              onClick={() => handleNavButtonClick(2)}
            >
              Resultado
            </NavButton>
          </li>
          <motion.span
            ref={scope}
            animate="swipe"
            className="col-span-1 block h-[2px] rounded-full bg-green-600"
          />
        </ul>
      </nav>

      <Swiper
        ref={sliderRef}
        onSlideChange={handleSlideChange}
        onSwiper={handleSlideChange}
        direction="horizontal"
        centeredSlides={true}
        longSwipesRatio={0.9}
        className="h-[calc(100vh-5.2rem)] w-full"
      >
        <SwiperSlide className="h-full overflow-y-auto">
          <Problem />
        </SwiperSlide>

        <SwiperSlide>
          <Code />
        </SwiperSlide>

        <SwiperSlide className="h-full overflow-y-auto">
          <Result />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
