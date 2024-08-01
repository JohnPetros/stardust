'use client'

import { tv } from 'tailwind-variants'

import type { BenchColor } from '../BenchColor'

const styles = tv({
  base: 'grid place-content-center p-1',
  variants: {
    background: {
      green: 'bg-green-500',
      blue: 'bg-blue-300',
      red: 'bg-red-300',
      yellow: 'bg-yellow-300',
    },
  },
})

type StyledTitleProps = {
  children: string
  background: BenchColor
}

export function StyledTitle({ children, background }: StyledTitleProps) {
  return (
    <div className={styles({ background })}>
      <h2 className='text-gray-900'>{children}</h2>
    </div>
  )
}
