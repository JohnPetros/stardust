'use client'

import { useId } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { AnimatedLabel } from './AnimatedLabel'
import { useOption } from './useOption'

type OptionProps = {
  label: string
  isSelected: boolean
  hasAutoFocus?: boolean
  onClick: () => void
}

export function Option({
  label,
  isSelected,
  hasAutoFocus = false,
  onClick,
}: OptionProps) {
  const id = useId()
  const { labelColor } = useOption(isSelected)

  return (
    <RadioGroup.Item id={id} value={label} asChild>
      <AnimatedLabel
        id={id}
        color={labelColor}
        hasAutoFocus={hasAutoFocus}
        onClick={onClick}
      >
        {label}
      </AnimatedLabel>
    </RadioGroup.Item>
  )
}
