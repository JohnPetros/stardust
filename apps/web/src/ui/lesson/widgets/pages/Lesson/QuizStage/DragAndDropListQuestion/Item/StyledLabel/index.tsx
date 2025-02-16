'use client'

import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Icon } from '@/ui/global/widgets/components/Icon'
import type { LabelBackground } from '../LabelBackground'
import type { IconColor } from '../IconColor'

const labelStyles = tv({
  base: 'rounded-md flex items-center justify-between bg-purple-700 border-2 p-3 w-full mx-auto custom-outline cursor-grab',
  variants: {
    background: {
      gray: 'border-gray-100 text-gray-100',
      red: 'border-red-700 text-red-700',
      green: 'border-green-500 text-green-500',
      blue: 'border-blue-300 text-blue-300',
      transparent: 'opacity-0',
    },
  },

  defaultVariants: {
    background: 'gray',
  },
})

const iconStyles = tv({
  base: 'text-lg',
  variants: {
    color: {
      gray: 'text-gray-100',
      blue: 'text-blue-300',
      red: 'text-red-700',
      green: 'text-green-500',
    },
  },

  defaultVariants: {
    color: 'gray',
  },
})

export type StyledLabelProps = {
  children: ReactNode
  background: LabelBackground
  iconColor: IconColor
}

export function StyledLabel({ children, background, iconColor }: StyledLabelProps) {
  return (
    <div className={labelStyles({ background })}>
      {children}
      <Icon name='three-dots' className={iconStyles({ color: iconColor })} />
    </div>
  )
}
