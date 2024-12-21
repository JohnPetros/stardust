'use client'

import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import type { BenchColor } from '../BenchColor'
import type { BenchSize } from '../BenchSize'

const styles = tv({
  base: 'h-20 overflow-hidden rounded-md border',
  variants: {
    border: {
      green: 'border-green-500',
      blue: 'border-blue-300',
      red: 'border-red-300',
      yellow: 'border-yellow-300',
    },
    size: {
      large: 'w-64',
      small: 'w-32',
    },
  },
})

type StyledBenchProps = {
  children: ReactNode
  border: BenchColor
  size: BenchSize
}

export function StyledBench({ children, border, size }: StyledBenchProps) {
  return <div className={styles({ border, size })}>{children}</div>
}
