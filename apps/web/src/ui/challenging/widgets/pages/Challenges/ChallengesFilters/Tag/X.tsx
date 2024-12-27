import { X as Icon } from '@phosphor-icons/react'

type XProps = {
  onRemove: VoidFunction
}

export function X({ onRemove }: XProps) {
  return (
    <button
      type='button'
      onClick={onRemove}
      className='grid place-content-center rounded-full bg-gray-400 p-[1px]'
    >
      <Icon className='text-gray-800' widths={8} weight='bold' />
    </button>
  )
}
