'use client'

import { type PropsWithChildren, useEffect } from 'react'
import { useMotionTemplate, useMotionValue, motion, animate } from 'framer-motion'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Particles } from '../../Particles'
import { Animation } from '@/ui/global/widgets/components/Animation'

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C']

export const AnimatedAuroraBackground = ({ children }: PropsWithChildren) => {
  const color = useMotionValue(COLORS_TOP[0])

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    })
  }, [color])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`
  const border = useMotionTemplate`1px solid ${color}`
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className='relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200'
    >
      {children}

      <motion.a
        href='#content'
        style={{
          border,
          boxShadow,
        }}
        whileHover={{
          scale: 1.015,
        }}
        whileTap={{
          scale: 0.985,
        }}
        className='mx-auto group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50 z-50'
      >
        Ver mais
        <Icon name='arrow-down' size={20} />
      </motion.a>

      <div className='mx-auto translate-y-3'>
        <Animation name='apollo-greeting' size={140} />
      </div>

      <Particles />
    </motion.section>
  )
}
