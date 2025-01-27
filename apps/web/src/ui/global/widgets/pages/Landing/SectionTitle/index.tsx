import type { ComponentProps } from 'react'

import { AnimatedReveal } from '../AnimatedReveal'

export function SectionTitle({ children, ...h2Props }: ComponentProps<'h2'>) {
  return (
    <div className='flex items-center gap-3'>
      <AnimatedReveal>
        <h2 {...h2Props} className='flex items-end font-bold text-4xl text-gray-50'>
          {children} <span className='text-green-400'>.</span>
        </h2>
      </AnimatedReveal>
      <span className='flex-1 h-px bg-gray-600' />
    </div>
  )
}
