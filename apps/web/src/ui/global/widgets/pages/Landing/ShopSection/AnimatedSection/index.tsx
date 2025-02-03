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
    <section
      ref={sectionRef}
      id='achivements'
      className='relative h-screen bg-[#160E30] overflow-hidden'
    >
      <motion.div className='absolute top-0 left-0 z-0 brightness-[0.50]'>
        <AnimatedOpacity delay={0.5} className='w-full'>
          <Animation name='space' size='full' hasLoop={false} />
        </AnimatedOpacity>
      </motion.div>

      <motion.div
        style={{ y: textBlockYPosition }}
        className='max-w-6xl mx-auto pt-16 z-20'
      >
        <Animation ref={animationRef} name='coins' size={220} hasLoop={false} />
        {children}
      </motion.div>

      <motion.div
        style={{ x: shopPreviewXPosition }}
        className='absolute top-0 right-0 h-full w-[48rem]'
      >
        <Image src='/images/shop-preview.png' fill alt='Preview da página de loja' />
      </motion.div>

      <div className='relative w-full h-full -translate-y-64'>
        <Image src='/images/mountains.png' fill alt='Montanhas' />
      </div>
    </section>
  )
}
