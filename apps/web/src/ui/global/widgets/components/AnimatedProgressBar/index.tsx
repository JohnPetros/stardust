'use client'

import * as Progress from '@radix-ui/react-progress'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { useAnimatedProgressBar } from './useAnimatedProgressBar'
import { forwardRef, useImperativeHandle, type ForwardedRef } from 'react'
import type { AnimatedProgressBarRef } from './types'

const AnimatedIndicator = motion(Progress.Indicator)

type ProgessBarProps = {
  value: number
  height: number
  indicatorImage?: string
  onAnimationEnd?: VoidFunction
}

const AnimatedProgressBarComponent = (
  { value, height, indicatorImage, onAnimationEnd }: ProgessBarProps,
  ref: ForwardedRef<AnimatedProgressBarRef>,
) => {
  const { animation, fill, handleAnimationComplete } = useAnimatedProgressBar(
    value,
    onAnimationEnd,
  )

  useImperativeHandle(
    ref,
    () => {
      return {
        fill,
      }
    },
    [fill],
  )

  return (
    <Progress.Root
      data-testid={`progress:${value}%`}
      value={value}
      max={100}
      className='flex w-full items-center rounded-lg bg-gray-400'
      style={{ height: height }}
    >
      <AnimatedIndicator
        animate={animation}
        onAnimationComplete={handleAnimationComplete}
        className='h-full rounded-lg bg-green-400'
      />

      {indicatorImage && (
        <div className='relative z-10 -ml-2 h-10 w-10 rotate-90'>
          <Image
            src={indicatorImage}
            fill
            sizes='(min-width: 375px) 2.5rem'
            alt=''
            priority
          />
        </div>
      )}
    </Progress.Root>
  )
}

export const AnimatedProgressBar = forwardRef(AnimatedProgressBarComponent)
