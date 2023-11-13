import { useState } from 'react'
import * as Slider from '@radix-ui/react-slider'

interface RangeInputProps {
  value: number
  min?: number
  max?: number
  step: number
  onValueChange: (value: number[]) => void
}

export function RangeInput({
  value,
  min = 10,
  max = 20,
  step,
  onValueChange,
}: RangeInputProps) {
  const [currentValue, setCurrentValue] = useState(value)

  console.log({ value })

  function handleValueChange([value]: number[]) {
    setCurrentValue(value)
  }

  return (
    <div className="z-50 flex h-2 w-36 items-center gap-3">
      <strong className="text-gray-100">{currentValue}</strong>
      <Slider.Root
        defaultValue={[currentValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        onValueCommit={onValueChange}
        className="relative flex h-3 w-full items-center justify-center"
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-gray-900">
          <Slider.Range className="absolute h-full rounded-full bg-gray-400 " />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 cursor-pointer rounded-full bg-gray-400"
          aria-label="Tamanho"
        />
      </Slider.Root>
    </div>
  )
}
