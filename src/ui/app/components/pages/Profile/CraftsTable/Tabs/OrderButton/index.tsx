import { twMerge } from 'tailwind-merge'

import type { IconName } from '@/ui/global/components/shared/Icon/types'
import { Icon } from '@/ui/global/components/shared/Icon'

type OrderButtonProps = {
  title: string
  isActive: boolean
  icon: IconName
}

export function OrderButton({ title, isActive, icon }: OrderButtonProps) {
  return (
    <button
      type='button'
      className={twMerge(
        'group hidden items-center gap-1 p-2 text-sm hover:text-gray-100 md:flex',
        isActive ? 'text-gray-100' : 'text-gray-400'
      )}
    >
      <Icon
        name={icon}
        className={twMerge(
          'group-hover:text-gray-100',
          isActive ? 'text-gray-100' : 'text-gray-400'
        )}
      />
      {title}
    </button>
  )
}
