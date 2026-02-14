import { Icon } from '@/ui/global/widgets/components/Icon'
import { twMerge } from 'tailwind-merge'

type Position = {
  top: number
  left: number
}

type Props = {
  label: string
  iconName: 'description' | 'code'
  position: Position
  onClick: () => void
}

export const SelectionActionButtonView = ({
  label,
  iconName,
  position,
  onClick,
}: Props) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge(
        'absolute z-50 flex items-center gap-2 px-3 py-1.5',
        'bg-[#1A1A1A] border border-[#333] rounded-md',
        'text-[#E0E0E0] text-sm font-medium',
        'shadow-lg hover:bg-[#252525] transition-colors',
        'cursor-pointer select-none',
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <Icon name='plus' className='w-4 h-4 text-green-400' />
      <span>{label}</span>
      <Icon name={iconName} className='w-4 h-4 ml-1' />
    </button>
  )
}
