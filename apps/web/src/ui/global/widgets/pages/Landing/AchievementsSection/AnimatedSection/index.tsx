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
  const textBlockYPosition = useTransform(scrollYProgress, [0, 1], ['0%', '500%'])
  const spaceXPosition = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={sectionRef} id='achivements'>
      <motion.div style={{ x: spaceXPosition }} className='z-[-5] brightness-[0.25]'>
        <AnimatedOpacity delay={0.5} className='h-full w-full'>
          <Animation name='space' size='full' hasLoop={true} />
        </AnimatedOpacity>
      </motion.div>

      <SectionTitle>{title}</SectionTitle>

      <motion.div style={{ y: textBlockYPosition }}>{children}</motion.div>

      <div className='w-full'>
        <Image src='/images/mountains.png' fill alt='Montanhas' />
      </div>
    </section>
  )
}
