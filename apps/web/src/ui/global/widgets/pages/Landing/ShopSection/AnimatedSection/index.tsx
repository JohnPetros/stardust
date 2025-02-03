'use client'

import Image from 'next/image'
import { type PropsWithChildren, useRef } from 'react'
import { motion } from 'framer-motion'

import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAnimatedSection } from './useAnimatedSection'

type AnimatedSectionProps = {
  title: string
}

export function AnimatedSection({ children }: PropsWithChildren<AnimatedSectionProps>) {
  const sectionRef = useRef(null)
  const animationRef = useRef<AnimationRef>(null)
  const { textBlockYPosition, shopPreviewXPosition } = useAnimatedSection(
    sectionRef,
    animationRef,
  )

  return (
    <section id='achivements'>
      <motion.div
        style={{ y: textBlockYPosition }}
        className='lg:hidden max-w-6xl mx-auto px-6 z-20'
      >
        <div className='translate-y-12'>
          <Animation ref={animationRef} name='coins' size={220} hasLoop={false} />
        </div>
        {children}
      </motion.div>

      <div
        ref={sectionRef}
        className='relative h-screen bg-[#160E30] overflow-hidden mt-12 lg:mt-0'
      >
        <motion.div className='absolute top-0 left-0 right-0 bottom-0 z-0 brightness-[0.50]'>
          <AnimatedOpacity delay={0.5} className='w-full'>
            <Animation name='space' size='full' hasLoop={false} />
          </AnimatedOpacity>
        </motion.div>

        <motion.div
          style={{ y: textBlockYPosition }}
          className='opacity-0 lg:opacity-100 max-w-6xl mx-auto pt-12 z-20'
        >
          <div className='translate-y-6'>
            <Animation ref={animationRef} name='coins' size={220} hasLoop={false} />
          </div>
          {children}
        </motion.div>

        <motion.div
          style={{ x: shopPreviewXPosition }}
          className='absolute left-0 bottom-0 lg:left-auto lg:bottom-auto lg:top-0 lg:right-0 h-full min-w-[48rem] w-full lg:w-[48rem]'
        >
          <Image src='/images/shop-preview.png' fill alt='Preview da página de loja' />
        </motion.div>

        <div className='relative w-full h-full mt-auto -translate-y-48'>
          <Image src='/images/mountains.png' fill alt='Montanhas' />
        </div>
      </div>
    </section>
  )
}
