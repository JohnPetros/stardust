import { motion } from 'motion/react'
import { forwardRef } from 'react'

type Props = {
  className: string
  elements: string[]
  inView: boolean
  fromSnapshot: Record<string, any>
  toSnapshots: Record<string, any>[]
  totalDuration: number
  times: number[]
  delay: number
  easing: (t: number) => number
  animateBy: 'words' | 'characters'
  onAnimationComplete?: () => void
}

export const BlurTextView = forwardRef<HTMLParagraphElement, Props>(
  (
    {
      className,
      elements,
      inView,
      fromSnapshot,
      toSnapshots,
      totalDuration,
      times,
      delay,
      easing,
      animateBy,
      onAnimationComplete,
    },
    ref,
  ) => {
    const buildKeyframes = (from: Record<string, any>, steps: Record<string, any>[]) => {
      const keys = new Set([
        ...Object.keys(from),
        ...steps.flatMap((s) => Object.keys(s)),
      ])

      const keyframes: Record<string, any[]> = {}
      keys.forEach((k) => {
        keyframes[k] = [from[k], ...steps.map((s) => s[k])]
      })
      return keyframes
    }

    return (
      <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
        {elements.map((segment, index) => {
          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

          const spanTransition = {
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing,
          }

          const uniqueKey = `${segment}-${index}-${animateBy}`

          return (
            <motion.span
              className='inline-block will-change-[transform,filter,opacity]'
              key={uniqueKey}
              initial={fromSnapshot}
              animate={inView ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={
                index === elements.length - 1 ? onAnimationComplete : undefined
              }
            >
              {segment === ' ' ? '\u00A0' : segment}
              {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
            </motion.span>
          )
        })}
      </p>
    )
  },
)
