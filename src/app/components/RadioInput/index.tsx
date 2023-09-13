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
    <div className="flex items-center gap-3 z-50 w-36 h-2">
      <strong className="text-gray-100">{currentValue}</strong>
      <Slider.Root
        defaultValue={[currentValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        onValueCommit={onValueChange}
        className="flex items-center justify-center relative w-full h-3"
      >
        <Slider.Track className="bg-gray-900 relative h-2 grow rounded-full">
          <Slider.Range className="bg-gray-400 absolute rounded-full h-full " />
        </Slider.Track>
        <Slider.Thumb
          className="block bg-gray-400 rounded-full w-4 h-4 cursor-pointer"
          aria-label="Tamanho"
        />
      </Slider.Root>
    </div>
  )
}
