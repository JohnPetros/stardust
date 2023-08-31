'use client'

import { useRef, useState } from 'react'

import { register } from 'swiper/element/bundle'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { Swiper as SwiperInstance } from 'swiper'

import { NavButton } from './NavButton'
import { Problem } from '../Problem'
import { Code } from '../Code'
import { Result } from '../Result'

register()
import 'swiper/css'
import 'swiper/css/navigation'

export function Slider() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const sliderRef = useRef<SwiperRef>(null)

  function handleNavButtonClick(slideIndex: number) {
    sliderRef.current?.swiper.slideTo(slideIndex)
  }

  function handleSlideChange(swiper: SwiperInstance) {
    setActiveSlideIndex(swiper.activeIndex)
  }

  return (
    <div>
      <nav className="bg-gray-900">
        <ul className="grid grid-cols-3">
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
        </ul>
      </nav>

      <Swiper
        ref={sliderRef}
        onSlideChange={handleSlideChange}
        onSwiper={handleSlideChange}
      >
        <SwiperSlide>
          <Problem />
        </SwiperSlide>

        <SwiperSlide>
          <Code />
        </SwiperSlide>

        <SwiperSlide>
          <Result />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
