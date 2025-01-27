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

export function Feature({ title, paragraph, children }: PropsWithChildren<FeatureProps>) {
  const containerRef = useRef(null)
  const { scrollXProgress } = useScroll({ target: containerRef })
  // const rocketYPosition = useTransform(scrollXProgress, [0, 1], [0, 300])
  const textYPosition = useTransform(scrollXProgress, [0, 1], [0, 300])

  console.log({ scrollXProgress })
  console.log({ textYPosition })

  return (
    <div className='flex w-full h-screen'>
      {/* <motion.div style={{ y: rocketYPosition }}>
        <Animation name='apollo-riding-rocket' size={96} />
      </motion.div> */}
      <div className='mx-auto flex-1 flex items-center justify-center gap-12'>
        <motion.div style={{ y: textYPosition }} className='max-w-96'>
          <AnimatedReveal>
            <h3 className='text-2xl text-gray-50 font-semibold'>{title}</h3>
          </AnimatedReveal>
          <Paragraph className='mt-3'>{paragraph}</Paragraph>
        </motion.div>
        <div ref={containerRef} className='w-full'>
          {children}
        </div>
      </div>
    </div>
  )
}
