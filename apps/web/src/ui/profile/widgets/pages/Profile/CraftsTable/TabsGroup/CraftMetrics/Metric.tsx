import { Icon } from '@/ui/global/widgets/components/Icon'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import type { ComponentProps } from 'react'

type MetricProps = {
  icon?: IconName
} & ComponentProps<'span'>

export function Metric({ children, icon, ...spanProps }: MetricProps) {
  return (
    <span className='flex items-center gap-1 text-sm text-gray-400' {...spanProps}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  )
}
