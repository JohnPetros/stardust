import { Swiper, SwiperSlide } from 'swiper/react'
import { motion } from 'motion/react'
import type { PropsWithChildren, RefObject } from 'react'
import type { SwiperRef } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types/ChallengeContent'

import { NavButton } from './NavButton'
import { ChallengeCodeEditorSlot } from '@/ui/challenging/widgets/slots/ChallengeCodeEditor'
import { ChallengeResultSlot } from '@/ui/challenging/widgets/slots/ChallengeResult'
import { ChallengeDescriptionSlot } from '@/ui/challenging/widgets/slots/ChallengeDescription'
import { AssistantChatbot } from '@/ui/challenging/widgets/layouts/Challenge/AssistantChatbot'

const CHALLENGE_CONTENT_LABELS: Record<ChallengeContent, string> = {
  comments: 'Comentários',
  solutions: 'Soluções',
  description: 'Descrição',
  result: 'Resultado',
}

type ChallengeSliderViewProps = PropsWithChildren<{
  swiperRef: RefObject<SwiperRef | null>
  motionScope: any
  activeSlideIndex: number
  activeContent: ChallengeContent
  slidesCount: number
  handleNavButtonClick: (slideIndex: number) => void
  handleSlideChange: (swiper: SwiperInstance) => void
}>

export const ChallengeSliderView = ({
  children,
  swiperRef,
  motionScope,
  activeSlideIndex,
  activeContent,
  handleNavButtonClick,
  handleSlideChange,
}: ChallengeSliderViewProps) => (
  <div>
    <nav className='bg-gray-900'>
      <ul className='relative grid grid-cols-4'>
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
        <li>
          <NavButton
            isActive={activeSlideIndex === 3}
            onClick={() => handleNavButtonClick(3)}
          >
            Assistente
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
        {activeContent === 'result' ? <ChallengeDescriptionSlot /> : (children as null)}
      </SwiperSlide>

      <SwiperSlide>
        <ChallengeCodeEditorSlot />
      </SwiperSlide>

      <SwiperSlide className='h-full overflow-y-auto'>
        <ChallengeResultSlot />
      </SwiperSlide>

      <SwiperSlide className='h-full overflow-y-auto'>
        <AssistantChatbot />
      </SwiperSlide>
    </Swiper>
  </div>
)
