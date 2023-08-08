'use client'

import { useEffect, useRef } from 'react'

import Image from 'next/image'
import { TypeWritter } from './TypeWritter'

import { getImage } from '@/utils/functions'

import { Variants, motion } from 'framer-motion'

import { tv } from 'tailwind-variants'

import type { Text as TextData } from '@/types/text'

const textAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: 0.3,
      type: 'tween',
      ease: 'linear',
    },
  },
}

const textStyles = tv({
  base: 'font-medium tracking-wider text-gray-100 text-sm w-full p-4 rounded-md',
  variants: {
    type: {
      default: 'bg-purple-700',
      alert: 'bg-yellow-400 text-yellow-700',
      quote: 'bg-blue-700 border-l-4 border-blue-300',
      list: 'border-green-400 text-green-400',
      image: '',
      code: '',
    },
  },
})

interface TextProps {
  data: TextData
  hasAnimation?: boolean
}

export function Text({
  data: { type, content, picture },
  hasAnimation,
}: TextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const textImage = picture ? getImage('texts', picture) : ''

  useEffect(() => {
    if (hasAnimation && textRef.current)
      textRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <motion.div
      ref={textRef}
      variants={textAnimations}
      initial={hasAnimation && 'hidden'}
      animate={hasAnimation && 'visible'}
      className="flex items-center gap-6"
    >
      {textImage && (
        <div className="relative w-24 h-16 bg-red-400 rounded-md overflow-hidden">
          <Image src={textImage} fill alt="Panda" />
        </div>
      )}
      <div className={textStyles({ type })}>
        {!Array.isArray(content) && (
          <TypeWritter canType={!!hasAnimation}>{content}</TypeWritter>
        )}
      </div>
    </motion.div>
  )
}
