'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { motion } from 'motion/react'
import type { PropsWithChildren } from 'react'

import { useChallengeSlider } from './useChallengeSlider'
import { NavButton } from './NavButton'
import { ChallengeCodeEditorSlot } from '../../../slots/ChallengeCodeEditor'
import { ChallengeResultSlot } from '../../../slots/ChallengeResult'
import { ChallengeDescriptionSlot } from '../../../slots/ChallengeDescription'

const CHALLENGE_CONTENT_LABELS: Record<string, string> = {
  comments: 'Comentários',
  solutions: 'Soluções',
  description: 'Descrição',
}

export function ChallengeSlider({ children }: PropsWithChildren) {
  const {
    swiperRef,
    motionScope,
    activeSlideIndex,
    activeContent,
    handleNavButtonClick,
    handleSlideChange,
  } = useChallengeSlider()

  return (
    <div>
      <nav className='bg-gray-900'>
        <ul className='relative grid grid-cols-3'>
          <li>
            <NavButton
              isActive={activeSlideIndex === 0}
              onClick={() => handleNavButtonClick(0)}
            >
              {CHALLENGE_CONTENT_LABELS[activeContent] ?? 'Descrição'}
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
            animate='swipe'
            className='col-span-1 block h-[2px] rounded-full bg-green-600'
          />
        </ul>
      </nav>

      <Swiper
        ref={swiperRef}
        onSlideChange={handleSlideChange}
        onSwiper={handleSlideChange}
        direction='horizontal'
        centeredSlides={true}
        longSwipesRatio={0.9}
        className='h-[calc(100vh-5.2rem)] w-full'
        simulateTouch={false}
        allowTouchMove={false}
      >
        <SwiperSlide className='h-full overflow-y-auto'>
          {activeContent === 'result' ? <ChallengeDescriptionSlot /> : children}
        </SwiperSlide>

        <SwiperSlide>
          <ChallengeCodeEditorSlot />
        </SwiperSlide>

        <SwiperSlide className='h-full overflow-y-auto'>
          <ChallengeResultSlot />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
