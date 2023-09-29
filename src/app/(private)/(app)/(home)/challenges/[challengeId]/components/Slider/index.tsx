'use client'

import { useEffect, useRef, useState } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { register } from 'swiper/element/bundle'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { Swiper as SwiperInstance } from 'swiper'

import { NavButton } from './NavButton'
import { Problem } from '../Problem'
import { Code } from '../Code'
import { Result } from '../Result'

register()
import { motion, useAnimate } from 'framer-motion'

export function Slider() {
  const { dispatch } = useChallengeContext()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [scope, animate] = useAnimate()
  const sliderRef = useRef<SwiperRef>(null)

  function showResultTab() {
    sliderRef.current?.swiper.slideTo(2)
  }

  function showCodeTab() {
    sliderRef.current?.swiper.slideTo(1)
  }

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
      dispatch({
        type: 'setTabHandler',
        payload: {
          showResultTab,
          showCodeTab,
        },
      })
  }, [showResultTab, showCodeTab])

  return (
    <div>
      <nav className="bg-gray-900">
        <ul className="grid grid-cols-3 relative">
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
            className="block col-span-1 h-[2px] bg-green-600 rounded-full"
          />
        </ul>
      </nav>

      <Swiper
        ref={sliderRef}
        onSlideChange={handleSlideChange}
        onSwiper={handleSlideChange}
        direction='horizontal'
        centeredSlides={true}
        longSwipesRatio={0.9}
        className="w-full h-[calc(100vh-5.2rem)]"
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
