'use client'

import Image from 'next/image'
import { type PropsWithChildren, useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { SectionTitle } from '../../SectionTitle'

type AnimatedSectionProps = {
  title: string
}

export function AnimatedSection({
  children,
  title,
}: PropsWithChildren<AnimatedSectionProps>) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const textBlockYPosition = useTransform(scrollYProgress, [0, 1], ['0%', '300%'])

  return (
    <section
      ref={sectionRef}
      id='achivements'
      className='relative h-screen bg-[#160E30] overflow-hidden'
    >
      <motion.div className='absolute top-0 left-0 z-0 brightness-[0.50]'>
        <AnimatedOpacity delay={0.5} className='w-full'>
          <Animation name='space' size='full' hasLoop={true} />
        </AnimatedOpacity>
      </motion.div>

      <motion.div
        style={{ y: textBlockYPosition }}
        className='flex flex-col items-center justify-center w-[28rem] mx-auto pt-16 z-20'
      >
        <Animation name='trophy' size={220} hasLoop={true} />
        {children}
      </motion.div>

      <div className='relative w-full h-full -translate-y-96'>
        <Image src='/images/mountains.png' fill alt='Montanhas' />
      </div>
    </section>
  )
}
