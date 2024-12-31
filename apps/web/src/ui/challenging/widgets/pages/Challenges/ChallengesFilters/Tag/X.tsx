import { Icon } from '@/ui/global/widgets/components/Icon'

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
      <Icon name='close' size={10} className='text-gray-800' weight='bold' />
    </button>
  )
}
