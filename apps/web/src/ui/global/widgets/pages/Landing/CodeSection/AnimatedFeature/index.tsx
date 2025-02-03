'use client'

import { useRef, type PropsWithChildren } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { Paragraph } from '../../Paragraph'
import { AnimatedReveal } from '../../AnimatedReveal'

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

  return (
    <div className='flex w-full h-screen pt-12'>
      <div className='mx-auto flex-1 flex items-center justify-center gap-6'>
        <motion.div
          style={{ rotate: '135deg' }}
          initial={{ y: -250, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className='w-max'
        >
          <Animation name='fast-rocket' size={96} />
        </motion.div>
        <motion.div
          style={{ y: textYPosition }}
          transition={{ duration: 0.2 }}
          className='w-96'
        >
          <AnimatedReveal>
            <h3 className='text-2xl text-gray-50 font-semibold'>{title}</h3>
          </AnimatedReveal>
          <Paragraph className='mt-3'>{paragraph}</Paragraph>
        </motion.div>
        <div ref={contentRef} className='flex-1'>
          {children}
        </div>
      </div>
    </div>
  )
}
