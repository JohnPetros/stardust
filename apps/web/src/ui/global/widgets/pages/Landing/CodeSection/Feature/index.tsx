'use client'

import { useRef, type PropsWithChildren } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { Paragraph } from '../../Paragraph'

type FeatureProps = {
  title: string
  paragraph: string
}

export function Feature({ title, paragraph, children }: PropsWithChildren<FeatureProps>) {
  const containerRef = useRef(null)
  const { scrollXProgress } = useScroll({ target: containerRef })
  const rocketYPosition = useTransform(scrollXProgress, [0, 1], [0, 300])
  const textYPosition = useTransform(scrollXProgress, [0, 1], [-300, 300])

  return (
    <div className='flex w-full h-full'>
      <motion.div style={{ y: rocketYPosition }}>
        <Animation name='apollo-riding-rocket' size={96} />
      </motion.div>
      <div className='mx-auto flex-1 grid grid-cols-2 gap-12'>
        <motion.div style={{ y: textYPosition }}>
          {title}
          <Paragraph>{paragraph}</Paragraph>
        </motion.div>
        <div ref={containerRef}>{children}</div>
      </div>
    </div>
  )
}
