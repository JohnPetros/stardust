'use client'

import { useRef, type PropsWithChildren } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { Paragraph } from '../../Paragraph'
import { AnimatedReveal } from '../../AnimatedReveal'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'

type FeatureProps = {
  title: string
  paragraph: string
}

export function AnimatedFeature({
  title,
  paragraph,
  children,
}: PropsWithChildren<FeatureProps>) {
  const contentRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: contentRef })
  const textYPosition = useTransform(scrollYProgress, [0, 1], [0, 100])
  const { lg } = useBreakpoint()

  return (
    <div className='flex w-full h-screen'>
      <div className='mx-auto flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6'>
        <div className='flex gap-6 px-6 lg:px-0'>
          <motion.div
            style={{ rotate: '135deg' }}
            initial={{ y: -250, x: lg ? -40 : 0, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Animation name='fast-rocket' size={96} />
          </motion.div>
          <motion.div
            style={!lg ? { y: textYPosition } : {}}
            transition={{ duration: 0.2 }}
            className='lg:w-96 w-full'
          >
            <AnimatedReveal>
              <h3 className='text-xl md:text-2xl text-gray-50 font-semibold'>{title}</h3>
            </AnimatedReveal>
            <Paragraph className='mt-3'>{paragraph}</Paragraph>
          </motion.div>
        </div>
        <div ref={contentRef} className='flex-1'>
          {children}
        </div>
      </div>
    </div>
  )
}
