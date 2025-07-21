import type { ReactNode } from 'react'

import type { IconName } from '@/ui/global/widgets/components/Icon/types/IconName'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  icon: IconName
  title: string
  value: ReactNode
}

export const MetricView = ({ icon, title, value }: Props) => {
  return (
    <div>
      <div className='flex items-center gap-2'>
        <Icon name={icon} />
        <h4 className='text-sm text-zinc-600'>{title}</h4>
      </div>
      <div className='mt-1'>{value}</div>
    </div>
  )
}
