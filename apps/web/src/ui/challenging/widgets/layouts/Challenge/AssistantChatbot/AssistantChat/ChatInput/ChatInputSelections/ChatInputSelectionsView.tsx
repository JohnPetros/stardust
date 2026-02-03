import { Icon } from '@/ui/global/widgets/components/Icon'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import { twMerge } from 'tailwind-merge'
import type { ChatInputSelectionItem } from './useChatInputSelections'

type Props = {
  selectionItems: ChatInputSelectionItem[]
}

const baseBadgeClasses =
  'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs cursor-pointer transition-colors'
const baseButtonClasses = 'ml-1 p-0.5 rounded transition-colors'
const baseLabelClasses = 'text-sm leading-none'

export const ChatInputSelectionsView = ({ selectionItems }: Props) => {
  return (
    <div className='flex flex-wrap gap-2 mb-2'>
      {selectionItems.map((selection) => (
        <Tooltip content={selection.tooltipContent} direction='top' key={selection.id}>
          <div className={twMerge(baseBadgeClasses, selection.badgeClassName)}>
            <Icon name={selection.iconName} className='w-3 h-3' />
            <span className={twMerge(baseLabelClasses, selection.labelClassName ?? '')}>
              {selection.label}
            </span>
            <button
              type='button'
              onClick={selection.onRemove}
              className={twMerge(baseButtonClasses, selection.removeButtonClassName)}
              aria-label={selection.removeAriaLabel}
            >
              <Icon name='close' className='w-3 h-3' />
            </button>
          </div>
        </Tooltip>
      ))}
    </div>
  )
}
