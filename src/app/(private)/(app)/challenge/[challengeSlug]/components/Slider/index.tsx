'use client'

import { register } from 'swiper/element/bundle'
import { Swiper, SwiperSlide } from 'swiper/react'

register()
import { motion } from 'framer-motion'

import { Editor } from '../../@codeEditor/components/Editor'
import { Description } from '../../@tabContent/components/Description'
import { Result } from '../../@tabContent/components/Result'

import { NavButton } from './NavButton'
import { useSlider } from './useSlider'

export function Slider() {
  const {
    swiperRef,
    motionScope,
    activeSlideIndex,
    handleNavButtonClick,
    handleSlideChange,
  } = useSlider()

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
            ref={motionScope}
            animate="swipe"
            className="col-span-1 block h-[2px] rounded-full bg-green-600"
          />
        </ul>
      </nav>

      <Swiper
        ref={swiperRef}
        onSlideChange={handleSlideChange}
        onSwiper={handleSlideChange}
        direction="horizontal"
        centeredSlides={true}
        longSwipesRatio={0.9}
        className="h-[calc(100vh-5.2rem)] w-full"
        simulateTouch={false}
        allowTouchMove={false}
      >
        <SwiperSlide className="h-full overflow-y-auto">
          <Description />
        </SwiperSlide>

        <SwiperSlide>
          <Editor />
        </SwiperSlide>

        <SwiperSlide className="h-full overflow-y-auto">
          <Result />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
