import { twMerge } from 'tailwind-merge'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  title: string
  isActive: boolean
  icon: IconName
  onClick: VoidFunction
}

export const SorterButtonView = ({ title, isActive, icon, onClick }: Props) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge(
        'group hidden items-center gap-1 p-2 text-sm hover:text-gray-100 md:flex',
        isActive ? 'text-gray-100' : 'text-gray-400',
      )}
    >
      <Icon
        name={icon}
        size={14}
        className={twMerge(
          'group-hover:text-gray-100',
          isActive ? 'text-gray-100' : 'text-gray-400',
        )}
      />
      {title}
    </button>
  )
}
