import type { ComponentProps } from 'react'
import { AnimatedReveal } from '../AnimatedReveal'
import { twMerge } from 'tailwind-merge'

export function Paragraph({
  children,
  className,
  ...paragraphProps
}: ComponentProps<'p'>) {
  return (
    <AnimatedReveal>
      <p
        className={twMerge('text-gray-200 text-lg leading-8 mt-3', className)}
        {...paragraphProps}
      >
        {children}
      </p>
    </AnimatedReveal>
  )
}
