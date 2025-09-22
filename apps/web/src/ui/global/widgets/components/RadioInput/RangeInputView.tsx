import * as Slider from '@radix-ui/react-slider'

type Props = {
  value: number
  id?: string
  min?: number
  max?: number
  step: number
  onValueChange: (value: number[]) => void
  onValueCommit: (value: number[]) => void
}

export const RangeInputView = ({
  value,
  id,
  min = 10,
  max = 20,
  step,
  onValueChange,
  onValueCommit,
}: Props) => {
  return (
    <div className='z-50 flex h-2 w-36 items-center gap-3'>
      <strong className='text-gray-100 w-10'>{value}</strong>
      <Slider.Root
        id={id}
        defaultValue={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        className='relative flex h-3 w-full items-center justify-center'
      >
        <Slider.Track className='relative h-2 grow rounded-full bg-gray-900'>
          <Slider.Range className='absolute h-full rounded-full bg-gray-400 ' />
        </Slider.Track>
        <Slider.Thumb
          className='block h-4 w-4 cursor-pointer rounded-full bg-gray-400'
          aria-label='Tamanho'
        />
      </Slider.Root>
    </div>
  )
}
