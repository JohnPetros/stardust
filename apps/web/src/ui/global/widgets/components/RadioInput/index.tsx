'use client'

import { RangeInputView } from './RangeInputView'
import { useRangeInput } from './useRangeInput'

type Props = {
  value: number
  id?: string
  min?: number
  max?: number
  step: number
  onValueChange: (value: number) => void
}

export const RangeInput = ({
  value,
  id,
  min = 10,
  max = 20,
  step,
  onValueChange,
}: Props) => {
  const { currentValue, handleValueChange, handleValueCommit } = useRangeInput(
    value,
    onValueChange,
  )

  return (
    <RangeInputView
      value={currentValue}
      id={id}
      min={min}
      max={max}
      step={step}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
    />
  )
}
