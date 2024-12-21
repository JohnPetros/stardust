'use client'

import Image from 'next/image'

import type { BenchColor } from './BenchColor'
import { AnimatedBench } from './AnimatedBench'
import { StyledBench } from './StyledBench'
import { StyledTitle } from './StyledTitle'

type MetricProps = {
  title: string
  amount: number | string
  icon: string
  color: BenchColor
  isLarge: boolean
  delay: number
}

export function Benchmark({ title, amount, icon, color, isLarge, delay }: MetricProps) {
  return (
    <AnimatedBench delay={delay}>
      <StyledBench border={color} size={isLarge ? 'large' : 'small'}>
        <StyledTitle background={color}>{title}</StyledTitle>
        <div className='flex items-center justify-center gap-2 pt-3'>
          <Image src={`/icons/${icon}`} width={24} height={24} alt='' />
          <strong className='block text-lg font-medium text-gray-100'>{amount}</strong>
        </div>
      </StyledBench>
    </AnimatedBench>
  )
}
